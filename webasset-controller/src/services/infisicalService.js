/**
 * Infisical Service - Manages secret retrieval from Infisical
 * Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
 */

const axios = require('axios');
const logger = require('../utils/logger');

class InfisicalService {
  constructor() {
    this.baseUrl = process.env.INFISICAL_URL || 'http://infisical:8080';
    this.token = process.env.INFISICAL_TOKEN;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  /**
   * Get credentials for a specific banking asset based on user groups
   */
  async getCredentials(asset, userGroups = []) {
    try {
      // Determine which secret path to use based on asset
      let secretPath;
      switch (asset) {
        case 'bmg':
          secretPath = '/banking/bmg/master-credentials';
          break;
        case 'icred':
          secretPath = '/banking/icred/master-credentials';
          break;
        default:
          secretPath = `/banking/${asset}/master-credentials`;
      }

      // Check user authorization for this asset
      if (!this.isAuthorized(asset, userGroups)) {
        logger.warn(`User groups ${userGroups.join(', ')} not authorized for asset ${asset}`);
        return null;
      }

      // Fetch secrets from Infisical
      const response = await this.client.get('/api/v2/secrets', {
        params: {
          path: secretPath,
          environment: process.env.NODE_ENV || 'production'
        }
      });

      if (!response.data || !response.data.secrets) {
        logger.warn(`No secrets found for asset ${asset}`);
        return null;
      }

      const secrets = response.data.secrets;
      
      // Parse credentials from secrets
      const credentials = {
        username: this.findSecret(secrets, 'username'),
        password: this.findSecret(secrets, 'password'),
        email: this.findSecret(secrets, 'email'),
        // Additional fields as needed
      };

      logger.info(`Retrieved credentials for asset ${asset}`);
      return credentials;
    } catch (error) {
      logger.error(`Failed to get credentials for asset ${asset}:`, error.message);
      return null;
    }
  }

  /**
   * Get list of available banking assets based on user groups
   */
  async getAvailableAssets(userGroups = []) {
    try {
      // Default banking assets
      const allAssets = [
        {
          id: 'bmg',
          name: 'BMG Consig',
          url: 'https://www.bmgconsig.com.br',
          requiredGroups: ['banking-users', 'bmg-access']
        },
        {
          id: 'icred',
          name: 'iCred API',
          url: 'https://api.icred.app',
          requiredGroups: ['banking-users', 'icred-access']
        }
      ];

      // Filter assets based on user groups
      const availableAssets = allAssets.filter(asset => 
        this.isAuthorized(asset.id, userGroups)
      );

      // Try to fetch additional custom assets from Infisical
      try {
        const response = await this.client.get('/api/v2/secrets', {
          params: {
            path: '/banking/custom-assets',
            environment: process.env.NODE_ENV || 'production'
          }
        });

        if (response.data && response.data.secrets) {
          const customAssets = this.parseCustomAssets(response.data.secrets);
          availableAssets.push(...customAssets.filter(asset => 
            this.isAuthorized(asset.id, userGroups)
          ));
        }
      } catch (error) {
        // Custom assets are optional, log but don't fail
        logger.debug('No custom assets configured');
      }

      return availableAssets;
    } catch (error) {
      logger.error('Failed to get available assets:', error.message);
      return [];
    }
  }

  /**
   * Check if user groups are authorized for an asset
   */
  isAuthorized(asset, userGroups) {
    // Define authorization rules
    const authRules = {
      'bmg': ['banking-users', 'bmg-access', 'admin'],
      'icred': ['banking-users', 'icred-access', 'admin'],
    };

    const requiredGroups = authRules[asset] || ['banking-users'];
    
    // User must have at least one of the required groups
    return userGroups.some(group => requiredGroups.includes(group));
  }

  /**
   * Find a specific secret by key name
   */
  findSecret(secrets, keyName) {
    const secret = secrets.find(s => 
      s.secretKey.toLowerCase() === keyName.toLowerCase()
    );
    return secret ? secret.secretValue : null;
  }

  /**
   * Parse custom assets from Infisical secrets
   */
  parseCustomAssets(secrets) {
    const assets = [];
    
    try {
      // Expect secrets in format: asset_<id>_name, asset_<id>_url, etc.
      const assetIds = new Set();
      
      secrets.forEach(secret => {
        const match = secret.secretKey.match(/^asset_(.+?)_/);
        if (match) {
          assetIds.add(match[1]);
        }
      });

      assetIds.forEach(id => {
        const name = this.findSecret(secrets, `asset_${id}_name`);
        const url = this.findSecret(secrets, `asset_${id}_url`);
        const groups = this.findSecret(secrets, `asset_${id}_groups`);

        if (name && url) {
          assets.push({
            id,
            name,
            url,
            requiredGroups: groups ? groups.split(',') : ['banking-users']
          });
        }
      });
    } catch (error) {
      logger.error('Failed to parse custom assets:', error);
    }

    return assets;
  }

  /**
   * Rotate master credentials (used by automation script)
   */
  async rotateCredentials(asset, newCredentials) {
    try {
      let secretPath;
      switch (asset) {
        case 'bmg':
          secretPath = '/banking/bmg/master-credentials';
          break;
        case 'icred':
          secretPath = '/banking/icred/master-credentials';
          break;
        default:
          secretPath = `/banking/${asset}/master-credentials`;
      }

      // Update secrets in Infisical
      for (const [key, value] of Object.entries(newCredentials)) {
        await this.client.post('/api/v2/secrets', {
          path: secretPath,
          environment: process.env.NODE_ENV || 'production',
          secretKey: key,
          secretValue: value
        });
      }

      logger.info(`Credentials rotated for asset ${asset}`);
      return true;
    } catch (error) {
      logger.error(`Failed to rotate credentials for asset ${asset}:`, error.message);
      return false;
    }
  }
}

module.exports = new InfisicalService();
