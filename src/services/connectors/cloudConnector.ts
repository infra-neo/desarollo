// Cloud Provider Connector Types
export type CloudProvider = 'gcp' | 'aws' | 'azure' | 'lxd' | 'microcloud';

export interface CloudCredentials {
  provider: CloudProvider;
  // GCP
  projectId?: string;
  keyFile?: string;
  
  // AWS
  accessKeyId?: string;
  secretAccessKey?: string;
  
  // Azure
  subscriptionId?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  
  // LXD/MicroCloud
  endpoint?: string;
  certPath?: string;
  keyPath?: string;
  serverCert?: string;
}

export interface CloudConnection {
  id: string;
  provider: CloudProvider;
  name: string;
  connected: boolean;
  lastConnected?: Date;
  regions?: string[];
}

export interface InstanceSize {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  disk: number;
  price?: number;
}

export interface OSImage {
  id: string;
  name: string;
  os: string;
  version: string;
  arch: string;
}

// Cloud Connector Interface (following Apache Libcloud pattern)
export interface ICloudConnector {
  connect(credentials: CloudCredentials): Promise<boolean>;
  disconnect(): Promise<void>;
  listRegions(): Promise<string[]>;
  listInstanceSizes(): Promise<InstanceSize[]>;
  listOSImages(): Promise<OSImage[]>;
  createInstance(config: any): Promise<string>;
  getInstanceStatus(instanceId: string): Promise<string>;
  deleteInstance(instanceId: string): Promise<void>;
}

// Mock implementation for demonstration (real implementation would use actual APIs)
export class CloudConnector implements ICloudConnector {
  private provider: CloudProvider;

  constructor(provider: CloudProvider) {
    this.provider = provider;
  }

  async connect(_credentials: CloudCredentials): Promise<boolean> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would validate credentials and establish connection
    return true;
  }

  async disconnect(): Promise<void> {
    // Disconnect implementation
  }

  async listRegions(): Promise<string[]> {
    const regionMap: Record<CloudProvider, string[]> = {
      gcp: ['us-central1', 'us-east1', 'europe-west1', 'asia-southeast1'],
      aws: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
      azure: ['eastus', 'westus', 'northeurope', 'southeastasia'],
      lxd: ['local'],
      microcloud: ['local'],
    };
    
    return regionMap[this.provider] || [];
  }

  async listInstanceSizes(): Promise<InstanceSize[]> {
    // Mock instance sizes
    return [
      { id: 'small', name: 'Small', cpu: 1, ram: 2, disk: 20 },
      { id: 'medium', name: 'Medium', cpu: 2, ram: 4, disk: 40 },
      { id: 'large', name: 'Large', cpu: 4, ram: 8, disk: 80 },
      { id: 'xlarge', name: 'Extra Large', cpu: 8, ram: 16, disk: 160 },
    ];
  }

  async listOSImages(): Promise<OSImage[]> {
    // Mock OS images
    return [
      { id: 'ubuntu-22.04', name: 'Ubuntu 22.04 LTS', os: 'Ubuntu', version: '22.04', arch: 'x86_64' },
      { id: 'ubuntu-20.04', name: 'Ubuntu 20.04 LTS', os: 'Ubuntu', version: '20.04', arch: 'x86_64' },
      { id: 'debian-11', name: 'Debian 11', os: 'Debian', version: '11', arch: 'x86_64' },
      { id: 'centos-8', name: 'CentOS 8', os: 'CentOS', version: '8', arch: 'x86_64' },
      { id: 'windows-server-2022', name: 'Windows Server 2022', os: 'Windows', version: '2022', arch: 'x86_64' },
    ];
  }

  async createInstance(_config: any): Promise<string> {
    // Mock instance creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `instance-${Date.now()}`;
  }

  async getInstanceStatus(_instanceId: string): Promise<string> {
    return 'running';
  }

  async deleteInstance(_instanceId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Connector factory
export const createConnector = (provider: CloudProvider): ICloudConnector => {
  return new CloudConnector(provider);
};
