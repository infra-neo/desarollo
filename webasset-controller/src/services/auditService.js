/**
 * Audit Service - Manages audit logging and JumpServer integration
 * Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
 */

const axios = require('axios');
const { Pool } = require('pg');
const logger = require('../utils/logger');

class AuditService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.jumpserverUrl = process.env.JUMPSERVER_API_URL;
    this.jumpserverToken = process.env.JUMPSERVER_API_TOKEN;
    
    if (this.jumpserverUrl && this.jumpserverToken) {
      this.jumpserverClient = axios.create({
        baseURL: this.jumpserverUrl,
        headers: {
          'Authorization': `Token ${this.jumpserverToken}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  /**
   * Log an audit event
   */
  async logEvent({ userId, action, details = {}, ipAddress = null }) {
    try {
      const query = `
        INSERT INTO audit_logs (user_id, action, details, ip_address, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `;

      const values = [
        userId,
        action,
        JSON.stringify(details),
        ipAddress
      ];

      const result = await this.pool.query(query, values);
      
      logger.info(`Audit log created: ${action} by user ${userId}`);

      // Also send to JumpServer if configured
      if (this.jumpserverClient && process.env.AUDIT_ENABLED === 'true') {
        await this.sendToJumpServer({
          userId,
          action,
          details,
          ipAddress,
          timestamp: new Date().toISOString()
        });
      }

      return result.rows[0].id;
    } catch (error) {
      logger.error('Failed to log audit event:', error);
      // Don't throw - audit logging failure shouldn't break the app
      return null;
    }
  }

  /**
   * Get audit logs for a user
   */
  async getAuditLogs({ userId, startDate, endDate, limit = 100 }) {
    try {
      let query = `
        SELECT id, user_id, action, details, ip_address, created_at
        FROM audit_logs
        WHERE user_id = $1
      `;

      const values = [userId];
      let paramIndex = 2;

      if (startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        values.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        query += ` AND created_at <= $${paramIndex}`;
        values.push(endDate);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
      values.push(limit);

      const result = await this.pool.query(query, values);
      
      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        details: row.details,
        ipAddress: row.ip_address,
        timestamp: row.created_at
      }));
    } catch (error) {
      logger.error('Failed to get audit logs:', error);
      throw error;
    }
  }

  /**
   * Send audit event to JumpServer
   */
  async sendToJumpServer(event) {
    if (!this.jumpserverClient) {
      return;
    }

    try {
      await this.jumpserverClient.post('/api/v1/audits/operate-log/', {
        user: event.userId,
        action: event.action,
        resource_type: 'webasset_session',
        resource: event.details.sessionId || 'N/A',
        remote_addr: event.ipAddress,
        datetime: event.timestamp,
        detail: JSON.stringify(event.details)
      });

      logger.debug(`Audit event sent to JumpServer: ${event.action}`);
    } catch (error) {
      logger.error('Failed to send audit to JumpServer:', error.message);
      // Don't throw - JumpServer integration is optional
    }
  }

  /**
   * Get session recording metadata from JumpServer
   */
  async getSessionRecordings(userId, sessionId = null) {
    if (!this.jumpserverClient) {
      return [];
    }

    try {
      const params = {
        user: userId
      };

      if (sessionId) {
        params.session = sessionId;
      }

      const response = await this.jumpserverClient.get('/api/v1/terminal/sessions/', {
        params
      });

      return response.data.results || [];
    } catch (error) {
      logger.error('Failed to get session recordings:', error.message);
      return [];
    }
  }

  /**
   * Close database connections
   */
  async close() {
    await this.pool.end();
  }
}

module.exports = new AuditService();
