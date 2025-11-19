/**
 * WebAsset Controller - Main Application
 * Banking Automation with SSO Authentication and Session Recording
 * Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Issuer } = require('openid-client');
const logger = require('./utils/logger');
const { initDatabase } = require('./database');
const browserService = require('./services/browserService');
const auditService = require('./services/auditService');
const infisicalService = require('./services/infisicalService');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Rate limiting for auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 auth requests per windowMs
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with sameSite for CSRF protection
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax', // CSRF protection
    maxAge: parseInt(process.env.SESSION_TIMEOUT || '1800') * 1000
  }
}));

// CSRF protection for state-changing operations
// Note: OIDC callback is exempt as it comes from external provider
const csrfProtection = csrf({ 
  cookie: false,  // Use session-based CSRF tokens
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

// Apply CSRF protection to API routes that modify state
app.use('/api/session/*', csrfProtection);

// OIDC Client
let oidcClient;

// Initialize OIDC
async function initializeOIDC() {
  try {
    const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
    oidcClient = new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      redirect_uris: [process.env.OIDC_REDIRECT_URI],
      response_types: ['code'],
    });
    logger.info('OIDC client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize OIDC client:', error);
    throw error;
  }
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes with rate limiting
app.get('/auth/login', authLimiter, (req, res) => {
  const authorizationUrl = oidcClient.authorizationUrl({
    scope: 'openid email profile',
    state: req.query.redirect || '/'
  });
  res.redirect(authorizationUrl);
});

app.get('/auth/callback', authLimiter, async (req, res) => {
  try {
    const params = oidcClient.callbackParams(req);
    const tokenSet = await oidcClient.callback(process.env.OIDC_REDIRECT_URI, params);
    const userinfo = await oidcClient.userinfo(tokenSet);
    
    req.session.user = {
      id: userinfo.sub,
      email: userinfo.email,
      name: userinfo.name,
      groups: userinfo.groups || [],
      tokenSet
    };

    // Log authentication
    await auditService.logEvent({
      userId: userinfo.sub,
      action: 'login',
      details: { email: userinfo.email },
      ipAddress: req.ip
    });

    const redirectTo = params.state || '/';
    res.redirect(redirectTo);
  } catch (error) {
    logger.error('Authentication callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.get('/auth/logout', async (req, res) => {
  if (req.session.user) {
    await auditService.logEvent({
      userId: req.session.user.id,
      action: 'logout',
      ipAddress: req.ip
    });
  }
  
  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destruction error:', err);
    }
    res.redirect('/');
  });
});

// Banking automation routes

/**
 * Start a banking session
 * POST /api/session/start
 * Body: { asset: 'bmg' | 'icred' | 'custom', customUrl?: string }
 */
app.post('/api/session/start', requireAuth, async (req, res) => {
  try {
    const { asset, customUrl } = req.body;
    const userId = req.session.user.id;

    // Get credentials from Infisical
    const credentials = await infisicalService.getCredentials(asset, req.session.user.groups);
    
    if (!credentials) {
      return res.status(403).json({ error: 'No credentials available for this asset' });
    }

    // Start browser session
    const sessionId = await browserService.createSession({
      userId,
      asset,
      customUrl,
      credentials,
      kioskMode: process.env.KIOSK_MODE === 'true',
      timeout: parseInt(process.env.SESSION_TIMEOUT || '1800')
    });

    // Log session start
    await auditService.logEvent({
      userId,
      action: 'session_start',
      details: { asset, sessionId },
      ipAddress: req.ip
    });

    res.json({ 
      sessionId,
      message: 'Session started successfully',
      expiresIn: parseInt(process.env.SESSION_TIMEOUT || '1800')
    });
  } catch (error) {
    logger.error('Session start error:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

/**
 * Get session status
 * GET /api/session/:sessionId/status
 */
app.get('/api/session/:sessionId/status', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.session.user.id;

    const status = await browserService.getSessionStatus(sessionId, userId);
    
    if (!status) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(status);
  } catch (error) {
    logger.error('Session status error:', error);
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

/**
 * Stop a banking session
 * POST /api/session/:sessionId/stop
 */
app.post('/api/session/:sessionId/stop', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.session.user.id;

    await browserService.stopSession(sessionId, userId);

    // Log session stop
    await auditService.logEvent({
      userId,
      action: 'session_stop',
      details: { sessionId },
      ipAddress: req.ip
    });

    res.json({ message: 'Session stopped successfully' });
  } catch (error) {
    logger.error('Session stop error:', error);
    res.status(500).json({ error: 'Failed to stop session' });
  }
});

/**
 * Audit endpoint for JumpServer integration
 * GET /api/audit
 */
app.get('/api/audit', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { startDate, endDate, limit = 100 } = req.query;

    const auditLogs = await auditService.getAuditLogs({
      userId,
      startDate,
      endDate,
      limit: parseInt(limit)
    });

    res.json({ logs: auditLogs });
  } catch (error) {
    logger.error('Audit fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

/**
 * Available banking assets
 * GET /api/assets
 */
app.get('/api/assets', requireAuth, async (req, res) => {
  try {
    const userGroups = req.session.user.groups;
    const availableAssets = await infisicalService.getAvailableAssets(userGroups);

    res.json({ assets: availableAssets });
  } catch (error) {
    logger.error('Assets fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch available assets' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize and start server
async function start() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized');

    // Initialize OIDC
    await initializeOIDC();

    // Initialize browser service
    await browserService.initialize();
    logger.info('Browser service initialized');

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`WebAsset Controller started on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Kiosk mode: ${process.env.KIOSK_MODE === 'true' ? 'enabled' : 'disabled'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await browserService.cleanup();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await browserService.cleanup();
  process.exit(0);
});

start();
