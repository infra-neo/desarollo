/**
 * Cloud Services - Manages cloud provider connections and operations
 * Migrated from @infra-neo/local_server_poc
 * Supports GCP and LXD with Apache Libcloud-like patterns
 */

import type {
  CloudConnection,
  InfrastructureConfig,
} from '@/types/cloud.types';

export interface CloudConnectionCreate {
  name: string;
  provider_type: 'gcp' | 'lxd' | 'huawei' | 'oracle' | 'aws' | 'azure' | 'digitalocean' | 'vultr' | 'alibaba';
  credentials: Record<string, any>;
  region?: string;
}

export interface CloudNode {
  id: string;
  name: string;
  state: string;
  provider_type: string;
  connection_id: string;
  ip_addresses: string[];
  extra?: Record<string, any>;
}

class CloudService {
  private connections: Map<string, CloudConnection> = new Map();
  private apiBaseUrl: string;

  constructor() {
    // Use backend API if available, otherwise work in local mode
    this.apiBaseUrl = import.meta.env.VITE_URL_API || '';
  }

  /**
   * Create a new cloud connection
   */
  async createConnection(data: CloudConnectionCreate): Promise<CloudConnection> {
    const connectionId = `${data.provider_type}-${Date.now()}`;
    
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          const connection = await response.json();
          this.connections.set(connection.id, connection);
          return connection;
        }
      } catch (error) {
        console.warn('Backend not available, using local storage:', error);
      }
    }

    // Local mode: Store in localStorage
    // WARNING: In production, credentials should be encrypted!
    // This is for development/testing only
    const connection: CloudConnection = {
      id: connectionId,
      name: data.name,
      provider_type: data.provider_type,
      region: data.region,
      status: 'connected',
      created_at: new Date().toISOString(),
      // Note: Credentials are NOT stored in local mode for security
      // They must be re-entered when needed or use backend storage
    };

    this.connections.set(connectionId, connection);
    this._saveToLocalStorage();
    
    return connection;
  }

  /**
   * List all cloud connections
   */
  async listConnections(): Promise<CloudConnection[]> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Backend not available, using local storage:', error);
      }
    }

    // Local mode: Read from localStorage
    this._loadFromLocalStorage();
    return Array.from(this.connections.values());
  }

  /**
   * Get a specific connection
   */
  async getConnection(connectionId: string): Promise<CloudConnection | null> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Backend not available, using local storage:', error);
      }
    }

    // Local mode
    this._loadFromLocalStorage();
    return this.connections.get(connectionId) || null;
  }

  /**
   * List nodes (VMs/containers) for a connection
   */
  async listNodes(connectionId: string): Promise<CloudNode[]> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}/nodes`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Backend not available, returning mock data:', error);
      }
    }

    // Mock data for testing
    const connection = await this.getConnection(connectionId);
    if (!connection) return [];

    // Return demo nodes based on provider type
    if (connection.provider_type === 'gcp') {
      return [
        {
          id: 'instance-1',
          name: 'web-server-1',
          state: 'running',
          provider_type: 'gcp',
          connection_id: connectionId,
          ip_addresses: ['34.68.124.46', '10.128.0.2'],
          extra: {
            machine_type: 'e2-medium',
            zone: connection.region || 'us-central1-a',
          },
        },
      ];
    } else if (connection.provider_type === 'lxd') {
      return [
        {
          id: 'container-1',
          name: 'ubuntu-container',
          state: 'running',
          provider_type: 'lxd',
          connection_id: connectionId,
          ip_addresses: ['10.0.0.100'],
          extra: {
            type: 'container',
            architecture: 'x86_64',
          },
        },
      ];
    }

    return [];
  }

  /**
   * Test connection to a cloud provider
   */
  async testConnection(connectionId: string): Promise<boolean> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}/test`, {
          method: 'POST',
          credentials: 'include',
        });
        
        return response.ok;
      } catch (error) {
        console.warn('Backend not available:', error);
      }
    }

    // Local mode: Always return true for testing
    const connection = await this.getConnection(connectionId);
    return connection !== null;
  }

  /**
   * Delete a cloud connection
   */
  async deleteConnection(connectionId: string): Promise<boolean> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (response.ok) {
          this.connections.delete(connectionId);
          return true;
        }
      } catch (error) {
        console.warn('Backend not available, using local storage:', error);
      }
    }

    // Local mode
    this.connections.delete(connectionId);
    this._saveToLocalStorage();
    return true;
  }

  /**
   * Create a new VM/container
   */
  async createNode(connectionId: string, config: InfrastructureConfig): Promise<CloudNode> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}/nodes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(config),
        });
        
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Backend not available, cannot create node:', error);
        throw new Error('Backend required for node creation');
      }
    }

    throw new Error('Backend API required for creating nodes');
  }

  /**
   * Control node operations (start, stop, restart)
   */
  async controlNode(connectionId: string, nodeId: string, action: 'start' | 'stop' | 'restart'): Promise<boolean> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}/nodes/${nodeId}/${action}`, {
          method: 'POST',
          credentials: 'include',
        });
        
        return response.ok;
      } catch (error) {
        console.warn('Backend not available, cannot control node:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Delete a node
   */
  async deleteNode(connectionId: string, nodeId: string): Promise<boolean> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/clouds/${connectionId}/nodes/${nodeId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        return response.ok;
      } catch (error) {
        console.warn('Backend not available, cannot delete node:', error);
        return false;
      }
    }

    return false;
  }

  // Private helper methods
  private _saveToLocalStorage() {
    try {
      const data = Array.from(this.connections.entries());
      localStorage.setItem('cloud_connections', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save connections to localStorage:', error);
    }
  }

  private _loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('cloud_connections');
      if (data) {
        const entries = JSON.parse(data);
        this.connections = new Map(entries);
      }
    } catch (error) {
      console.error('Failed to load connections from localStorage:', error);
    }
  }
}

// Export singleton instance
export const cloudService = new CloudService();
export default cloudService;
