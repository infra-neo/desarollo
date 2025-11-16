const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: OpenIDConnectStrategy } = require('passport-openidconnect');
const { chromium } = require('playwright');
const axios = require('axios');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'webasset.log' })
  ]
});

// App configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
passport.use('oidc', new OpenIDConnectStrategy({
  issuer: process.env.OIDC_ISSUER,
  authorizationURL: `${process.env.OIDC_ISSUER}/authorize`,
  tokenURL: `${process.env.OIDC_ISSUER}/token`,
  userInfoURL: `${process.env.OIDC_ISSUER}/userinfo`,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  callbackURL: process.env.OIDC_REDIRECT_URI,
  scope: ['openid', 'profile', 'email']
}, (issuer, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static('public'));

// Store active browser sessions
const activeSessions = new Map();

// Banking sites configuration
const BANKING_SITES = {
  'bmg': {
    name: 'BMG Consig',
    url: 'https://www.bmgconsig.com.br/Index.do?method=prepare',
    selectors: {
      username: '#username',
      password: '#password',
      submit: '#loginButton'
    }
  },
  'icred': {
    name: 'iCred',
    url: 'https://api.icred.app/authorization-server/custom-login',
    selectors: {
      username: 'input[name="username"]',
      password: 'input[name="password"]',
      submit: 'button[type="submit"]'
    }
  }
  // Add 23 more banking sites here
};

// Infisical client for fetching secrets
class InfisicalClient {
  constructor() {
    this.baseURL = process.env.INFISICAL_URL;
    this.token = process.env.INFISICAL_TOKEN;
  }

  async getSecret(secretName, workspaceId = 'default') {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/secret/${secretName}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          params: {
            workspaceId
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`Error fetching secret: ${error.message}`);
      throw error;
    }
  }
}

const infisicalClient = new InfisicalClient();

// JumpServer integration for session recording
class JumpServerClient {
  constructor() {
    this.baseURL = process.env.JUMPSERVER_URL;
    this.apiKey = process.env.JUMPSERVER_API_KEY;
  }

  async createSession(userId, assetName, assetUrl) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/terminal/sessions/`,
        {
          user: userId,
          asset: assetName,
          system_user: 'web-auto',
          login_from: 'W',
          remote_addr: '127.0.0.1',
          is_finished: false,
          date_start: new Date().toISOString(),
          protocol: 'http'
        },
        {
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`Error creating JumpServer session: ${error.message}`);
      return null;
    }
  }

  async updateSession(sessionId, data) {
    try {
      await axios.patch(
        `${this.baseURL}/api/v1/terminal/sessions/${sessionId}/`,
        data,
        {
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      logger.error(`Error updating JumpServer session: ${error.message}`);
    }
  }
}

const jumpServerClient = new JumpServerClient();

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>WebAsset Controller</title></head>
      <body>
        <h1>MCP WebAsset Controller</h1>
        <p>Secure credential injection and session management</p>
        ${req.isAuthenticated() 
          ? `<p>Welcome, ${req.user.displayName || req.user.email}!</p>
             <a href="/sites">Access Banking Sites</a> | 
             <a href="/auth/logout">Logout</a>`
          : `<a href="/auth/login">Login with SSO</a>`
        }
      </body>
    </html>
  `);
});

// Authentication routes
app.get('/auth/login', passport.authenticate('oidc'));

app.get('/auth/callback',
  passport.authenticate('oidc', { failureRedirect: '/auth/error' }),
  (req, res) => {
    logger.info(`User logged in: ${req.user.email}`);
    res.redirect('/sites');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/auth/error', (req, res) => {
  res.status(401).send('Authentication failed');
});

// Sites listing
app.get('/sites', ensureAuthenticated, (req, res) => {
  const sitesList = Object.entries(BANKING_SITES)
    .map(([key, site]) => `<li><a href="/launch/${key}" target="_blank">${site.name}</a></li>`)
    .join('');
  
  res.send(`
    <html>
      <head><title>Banking Sites</title></head>
      <body>
        <h1>Available Banking Sites</h1>
        <p>User: ${req.user.displayName || req.user.email}</p>
        <ul>${sitesList}</ul>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
});

// Launch a banking site with auto-fill
app.get('/launch/:siteKey', ensureAuthenticated, async (req, res) => {
  const { siteKey } = req.params;
  const site = BANKING_SITES[siteKey];
  
  if (!site) {
    return res.status(404).send('Site not found');
  }

  const sessionId = uuidv4();
  const userId = req.user.email || req.user.id;

  try {
    // Fetch credentials from Infisical
    logger.info(`Fetching credentials for ${site.name} from Infisical`);
    const credentials = await infisicalClient.getSecret(`banking_${siteKey}`);
    
    // Create JumpServer session for auditing
    const jumpSession = await jumpServerClient.createSession(userId, site.name, site.url);
    
    // Launch browser session
    logger.info(`Launching browser session for ${site.name}`);
    const browser = await chromium.launch({
      headless: process.env.BROWSER_HEADLESS === 'true',
      args: process.env.BROWSER_KIOSK_MODE === 'true' 
        ? ['--kiosk', '--disable-infobars', '--no-first-run']
        : []
    });
    
    const context = await browser.newContext({
      recordVideo: {
        dir: './recordings/',
        size: { width: 1920, height: 1080 }
      }
    });
    
    const page = await context.newPage();
    
    // Navigate to the banking site
    await page.goto(site.url);
    
    // Wait for login form
    await page.waitForSelector(site.selectors.username, { timeout: 10000 });
    
    // Auto-fill credentials
    await page.fill(site.selectors.username, credentials.username);
    await page.fill(site.selectors.password, credentials.password);
    
    logger.info(`Credentials auto-filled for ${site.name}`);
    
    // Click submit button
    await page.click(site.selectors.submit);
    
    // Store session info
    activeSessions.set(sessionId, {
      browser,
      context,
      page,
      userId,
      siteName: site.name,
      siteKey,
      jumpSessionId: jumpSession?.id,
      startTime: new Date()
    });
    
    // Monitor page close
    page.on('close', async () => {
      await cleanupSession(sessionId);
    });
    
    logger.info(`Session ${sessionId} created for ${userId} on ${site.name}`);
    
    res.json({
      success: true,
      sessionId,
      message: `Launched ${site.name} with auto-filled credentials`,
      site: site.name
    });
    
  } catch (error) {
    logger.error(`Error launching ${site.name}: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Close session
app.post('/session/:sessionId/close', ensureAuthenticated, async (req, res) => {
  const { sessionId } = req.params;
  await cleanupSession(sessionId);
  res.json({ success: true, message: 'Session closed' });
});

// Cleanup session helper
async function cleanupSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) return;
  
  try {
    // Update JumpServer session
    if (session.jumpSessionId) {
      await jumpServerClient.updateSession(session.jumpSessionId, {
        is_finished: true,
        date_end: new Date().toISOString()
      });
    }
    
    // Close browser
    await session.context.close();
    await session.browser.close();
    
    activeSessions.delete(sessionId);
    logger.info(`Session ${sessionId} cleaned up`);
  } catch (error) {
    logger.error(`Error cleaning up session ${sessionId}: ${error.message}`);
  }
}

// List active sessions
app.get('/sessions', ensureAuthenticated, (req, res) => {
  const sessions = Array.from(activeSessions.entries()).map(([id, session]) => ({
    sessionId: id,
    userId: session.userId,
    site: session.siteName,
    startTime: session.startTime
  }));
  res.json(sessions);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSessions: activeSessions.size,
    uptime: process.uptime()
  });
});

// Cleanup on shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, cleaning up sessions...');
  for (const sessionId of activeSessions.keys()) {
    await cleanupSession(sessionId);
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`WebAsset Controller listening on port ${PORT}`);
  console.log(`WebAsset Controller running on http://localhost:${PORT}`);
});
