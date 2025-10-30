/**
 * Headscale API Service
 * 
 * This service provides a clean interface to interact with Headscale server
 * for machine registration, management, and VPN network control.
 */

import axios, { type AxiosInstance } from 'axios';

// Types
export interface MachineToken {
  token: string;
  expiresAt: Date;
  machineKey: string;
  machineName: string;
}

export interface RegisteredMachine {
  id: string;
  name: string;
  ipAddress: string;
  status: 'connected' | 'disconnected';
  lastSeen: Date;
  os: string;
  user: string;
  createdAt: Date;
  tags?: string[];
}

export interface PreAuthKey {
  id: string;
  key: string;
  reusable: boolean;
  ephemeral: boolean;
  used: boolean;
  expiration: Date;
  createdAt: Date;
}

export interface NetworkRoute {
  id: string;
  enabled: boolean;
  advertised: boolean;
  prefix: string;
  machine: string;
}

export interface HeadscaleConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
}

export class HeadscaleService {
  private client: AxiosInstance;

  constructor(config: HeadscaleConfig) {
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate a registration token for a new machine
   * 
   * @param machineName - Name for the machine
   * @param expiresIn - Token expiration in hours (default: 24)
   * @returns Registration token details
   */
  async generateRegistrationToken(
    machineName: string,
    expiresIn: number = 24
  ): Promise<MachineToken> {
    try {
      const response = await this.client.post('/api/v1/preauthkey', {
        reusable: false,
        ephemeral: false,
        expiration: new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString(),
        tags: [`machine:${machineName}`],
      });

      const { preAuthKey } = response.data;

      return {
        token: preAuthKey.key,
        expiresAt: new Date(preAuthKey.expiration),
        machineKey: preAuthKey.id,
        machineName,
      };
    } catch (error) {
      console.error('Error generating registration token:', error);
      throw new Error('Failed to generate registration token');
    }
  }

  /**
   * List all registered machines
   * 
   * @param userId - Optional user ID to filter machines
   * @returns Array of registered machines
   */
  async listMachines(userId?: string): Promise<RegisteredMachine[]> {
    try {
      const response = await this.client.get('/api/v1/machine');
      
      let machines = response.data.machines || [];
      
      // Filter by user if specified
      if (userId) {
        machines = machines.filter((m: any) => m.user?.name === userId);
      }

      return machines.map((machine: any) => ({
        id: machine.id,
        name: machine.name,
        ipAddress: machine.ipAddresses?.[0] || '',
        status: machine.online ? 'connected' : 'disconnected',
        lastSeen: new Date(machine.lastSeen),
        os: this.detectOS(machine.hostInfo),
        user: machine.user?.name || '',
        createdAt: new Date(machine.createdAt),
        tags: machine.forcedTags || [],
      }));
    } catch (error) {
      console.error('Error listing machines:', error);
      throw new Error('Failed to list machines');
    }
  }

  /**
   * Get details for a specific machine
   * 
   * @param machineId - Machine ID
   * @returns Machine details
   */
  async getMachine(machineId: string): Promise<RegisteredMachine | null> {
    try {
      const response = await this.client.get(`/api/v1/machine/${machineId}`);
      const machine = response.data.machine;

      if (!machine) return null;

      return {
        id: machine.id,
        name: machine.name,
        ipAddress: machine.ipAddresses?.[0] || '',
        status: machine.online ? 'connected' : 'disconnected',
        lastSeen: new Date(machine.lastSeen),
        os: this.detectOS(machine.hostInfo),
        user: machine.user?.name || '',
        createdAt: new Date(machine.createdAt),
        tags: machine.forcedTags || [],
      };
    } catch (error) {
      console.error('Error getting machine:', error);
      return null;
    }
  }

  /**
   * Delete a registered machine
   * 
   * @param machineId - Machine ID to delete
   * @returns Success status
   */
  async deleteMachine(machineId: string): Promise<boolean> {
    try {
      await this.client.delete(`/api/v1/machine/${machineId}`);
      return true;
    } catch (error) {
      console.error('Error deleting machine:', error);
      return false;
    }
  }

  /**
   * Rename a machine
   * 
   * @param machineId - Machine ID
   * @param newName - New name for the machine
   * @returns Success status
   */
  async renameMachine(machineId: string, newName: string): Promise<boolean> {
    try {
      await this.client.post(`/api/v1/machine/${machineId}/rename/${newName}`);
      return true;
    } catch (error) {
      console.error('Error renaming machine:', error);
      return false;
    }
  }

  /**
   * Expire a machine (force re-authentication)
   * 
   * @param machineId - Machine ID
   * @returns Success status
   */
  async expireMachine(machineId: string): Promise<boolean> {
    try {
      await this.client.post(`/api/v1/machine/${machineId}/expire`);
      return true;
    } catch (error) {
      console.error('Error expiring machine:', error);
      return false;
    }
  }

  /**
   * List all pre-auth keys
   * 
   * @returns Array of pre-auth keys
   */
  async listPreAuthKeys(): Promise<PreAuthKey[]> {
    try {
      const response = await this.client.get('/api/v1/preauthkey');
      const keys = response.data.preAuthKeys || [];

      return keys.map((key: any) => ({
        id: key.id,
        key: key.key,
        reusable: key.reusable,
        ephemeral: key.ephemeral,
        used: key.used,
        expiration: new Date(key.expiration),
        createdAt: new Date(key.createdAt),
      }));
    } catch (error) {
      console.error('Error listing pre-auth keys:', error);
      throw new Error('Failed to list pre-auth keys');
    }
  }

  /**
   * Expire a pre-auth key
   * 
   * @param keyId - Key ID to expire
   * @returns Success status
   */
  async expirePreAuthKey(keyId: string): Promise<boolean> {
    try {
      await this.client.post(`/api/v1/preauthkey/${keyId}/expire`);
      return true;
    } catch (error) {
      console.error('Error expiring pre-auth key:', error);
      return false;
    }
  }

  /**
   * Get network routes
   * 
   * @returns Array of network routes
   */
  async listRoutes(): Promise<NetworkRoute[]> {
    try {
      const response = await this.client.get('/api/v1/routes');
      const routes = response.data.routes || [];

      return routes.map((route: any) => ({
        id: route.id,
        enabled: route.enabled,
        advertised: route.advertised,
        prefix: route.prefix,
        machine: route.machine?.name || '',
      }));
    } catch (error) {
      console.error('Error listing routes:', error);
      throw new Error('Failed to list routes');
    }
  }

  /**
   * Enable or disable a route
   * 
   * @param routeId - Route ID
   * @param enabled - Enable or disable the route
   * @returns Success status
   */
  async setRouteEnabled(routeId: string, enabled: boolean): Promise<boolean> {
    try {
      const endpoint = enabled 
        ? `/api/v1/routes/${routeId}/enable`
        : `/api/v1/routes/${routeId}/disable`;
      
      await this.client.post(endpoint);
      return true;
    } catch (error) {
      console.error('Error setting route status:', error);
      return false;
    }
  }

  /**
   * Get machine tags
   * 
   * @param machineId - Machine ID
   * @returns Array of tags
   */
  async getMachineTags(machineId: string): Promise<string[]> {
    try {
      const machine = await this.getMachine(machineId);
      return machine?.tags || [];
    } catch (error) {
      console.error('Error getting machine tags:', error);
      return [];
    }
  }

  /**
   * Set machine tags
   * 
   * @param machineId - Machine ID
   * @param tags - Array of tags to set
   * @returns Success status
   */
  async setMachineTags(machineId: string, tags: string[]): Promise<boolean> {
    try {
      await this.client.post(`/api/v1/machine/${machineId}/tags`, {
        tags,
      });
      return true;
    } catch (error) {
      console.error('Error setting machine tags:', error);
      return false;
    }
  }

  /**
   * Get server info
   * 
   * @returns Server information
   */
  async getServerInfo(): Promise<any> {
    try {
      const response = await this.client.get('/api/v1/apikey');
      return response.data;
    } catch (error) {
      console.error('Error getting server info:', error);
      throw new Error('Failed to get server info');
    }
  }

  /**
   * Helper method to detect OS from host info
   */
  private detectOS(hostInfo: any): string {
    if (!hostInfo) return 'Unknown';
    
    const os = hostInfo.os || '';
    if (os.includes('windows')) return 'Windows';
    if (os.includes('darwin') || os.includes('macos')) return 'macOS';
    if (os.includes('linux')) return 'Linux';
    
    return 'Unknown';
  }
}

// Export a factory function for creating the service
export const createHeadscaleService = (config: HeadscaleConfig): HeadscaleService => {
  return new HeadscaleService(config);
};

// Default export
export default HeadscaleService;
