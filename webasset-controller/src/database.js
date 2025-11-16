/**
 * Database initialization and schema
 * Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
 */

const { Pool } = require('pg');
const logger = require('./utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDatabase() {
  try {
    // Create audit_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at),
        INDEX idx_action (action)
      )
    `);

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        asset VARCHAR(100) NOT NULL,
        start_time TIMESTAMP NOT NULL DEFAULT NOW(),
        end_time TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        recording_path VARCHAR(500),
        metadata JSONB,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_start_time (start_time)
      )
    `);

    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

module.exports = { initDatabase, pool };
