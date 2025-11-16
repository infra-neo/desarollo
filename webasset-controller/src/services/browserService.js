/**
 * Browser Service - Manages Playwright browser sessions for banking automation
 * Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
 */

const { chromium } = require('playwright');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class BrowserService {
  constructor() {
    this.sessions = new Map();
    this.browser = null;
  }

  async initialize() {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled'
        ]
      });
      logger.info('Browser initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async createSession({ userId, asset, customUrl, credentials, kioskMode, timeout }) {
    const sessionId = uuidv4();
    
    try {
      const context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        recordVideo: {
          dir: '/app/data/recordings',
          size: { width: 1920, height: 1080 }
        }
      });

      const page = await context.newPage();

      // Session metadata
      const session = {
        id: sessionId,
        userId,
        asset,
        context,
        page,
        startTime: new Date(),
        lastActivity: new Date(),
        kioskMode,
        timeout
      };

      this.sessions.set(sessionId, session);

      // Start banking automation based on asset type
      if (asset === 'bmg') {
        await this.automateBMG(session, credentials);
      } else if (asset === 'icred') {
        await this.automateICred(session, credentials);
      } else if (customUrl) {
        await this.automateCustom(session, customUrl, credentials);
      } else {
        throw new Error('Invalid asset type or missing custom URL');
      }

      // Set up auto-close timer
      if (timeout) {
        session.timeoutId = setTimeout(() => {
          this.stopSession(sessionId, userId);
        }, timeout * 1000);
      }

      logger.info(`Session ${sessionId} created for user ${userId}`);
      return sessionId;
    } catch (error) {
      logger.error(`Failed to create session ${sessionId}:`, error);
      
      // Cleanup on error
      if (this.sessions.has(sessionId)) {
        const session = this.sessions.get(sessionId);
        await session.context.close();
        this.sessions.delete(sessionId);
      }
      
      throw error;
    }
  }

  async automateBMG(session, credentials) {
    const { page } = session;
    const url = process.env.BMG_CONSIG_URL || 'https://www.bmgconsig.com.br/Index.do?method=prepare';

    try {
      logger.info(`Starting BMG automation for session ${session.id}`);
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for login form
      await page.waitForSelector('input[name="username"], input[type="text"]', { timeout: 10000 });
      
      // Fill credentials
      await page.fill('input[name="username"], input[type="text"]', credentials.username);
      await page.fill('input[name="password"], input[type="password"]', credentials.password);
      
      // Submit form
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Wait for navigation
      await page.waitForNavigation({ timeout: 30000 });
      
      // Handle 2FA if needed
      if (await page.isVisible('input[name="otp"], input[name="token"]')) {
        logger.info('2FA detected, waiting for manual input');
        // In production, integrate with 2FA service or manual approval flow
      }

      logger.info(`BMG automation completed for session ${session.id}`);
    } catch (error) {
      logger.error(`BMG automation failed for session ${session.id}:`, error);
      throw error;
    }
  }

  async automateICred(session, credentials) {
    const { page } = session;
    const url = process.env.ICRED_API_URL || 'https://api.icred.app/authorization-server/custom-login';

    try {
      logger.info(`Starting iCred automation for session ${session.id}`);
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for login form
      await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
      
      // Fill credentials
      await page.fill('input[name="email"], input[type="email"]', credentials.email);
      await page.fill('input[name="password"], input[type="password"]', credentials.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForNavigation({ timeout: 30000 });
      
      logger.info(`iCred automation completed for session ${session.id}`);
    } catch (error) {
      logger.error(`iCred automation failed for session ${session.id}:`, error);
      throw error;
    }
  }

  async automateCustom(session, url, credentials) {
    const { page } = session;

    try {
      logger.info(`Starting custom automation for session ${session.id}`);
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Generic login detection and automation
      // This is a best-effort approach for custom sites
      const loginSelectors = [
        'input[type="text"]',
        'input[name="username"]',
        'input[name="email"]',
        'input[id="username"]',
        'input[id="email"]'
      ];

      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]'
      ];

      // Try to find and fill login fields
      for (const selector of loginSelectors) {
        if (await page.isVisible(selector)) {
          await page.fill(selector, credentials.username || credentials.email);
          break;
        }
      }

      for (const selector of passwordSelectors) {
        if (await page.isVisible(selector)) {
          await page.fill(selector, credentials.password);
          break;
        }
      }

      // Try to find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Login")',
        'button:has-text("Entrar")',
        'button:has-text("Sign in")'
      ];

      for (const selector of submitSelectors) {
        if (await page.isVisible(selector)) {
          await page.click(selector);
          await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
          break;
        }
      }

      logger.info(`Custom automation completed for session ${session.id}`);
    } catch (error) {
      logger.error(`Custom automation failed for session ${session.id}:`, error);
      throw error;
    }
  }

  async getSessionStatus(sessionId, userId) {
    const session = this.sessions.get(sessionId);
    
    if (!session || session.userId !== userId) {
      return null;
    }

    return {
      id: session.id,
      asset: session.asset,
      startTime: session.startTime,
      lastActivity: session.lastActivity,
      kioskMode: session.kioskMode,
      isActive: true
    };
  }

  async stopSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);
    
    if (!session || session.userId !== userId) {
      throw new Error('Session not found or unauthorized');
    }

    try {
      // Clear timeout
      if (session.timeoutId) {
        clearTimeout(session.timeoutId);
      }

      // Close browser context
      await session.context.close();

      // Remove from active sessions
      this.sessions.delete(sessionId);

      logger.info(`Session ${sessionId} stopped successfully`);
    } catch (error) {
      logger.error(`Failed to stop session ${sessionId}:`, error);
      throw error;
    }
  }

  async cleanup() {
    logger.info('Cleaning up browser service...');
    
    // Close all active sessions
    for (const [sessionId, session] of this.sessions) {
      try {
        await session.context.close();
        logger.info(`Closed session ${sessionId}`);
      } catch (error) {
        logger.error(`Error closing session ${sessionId}:`, error);
      }
    }

    this.sessions.clear();

    // Close browser
    if (this.browser) {
      await this.browser.close();
      logger.info('Browser closed');
    }
  }
}

module.exports = new BrowserService();
