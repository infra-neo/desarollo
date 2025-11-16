/**
 * Cloud Types
 * Type definitions for cloud provider management
 * Migrated from @infra-neo/local_server_poc
 */

export type CloudProvider = 
  | 'gcp' 
  | 'lxd' 
  | 'aws' 
  | 'azure' 
  | 'digitalocean' 
  | 'vultr' 
  | 'alibaba' 
  | 'oracle' 
  | 'huawei';

export interface CloudCredentials {
  // GCP credentials
  projectId?: string;
  keyFile?: string;
  serviceAccountJson?: string;
  
  // LXD credentials
  endpoint?: string;
  cert?: string;
  certPath?: string;
  key?: string;
  keyPath?: string;
  verify?: boolean;
  
  // Common credentials
  username?: string;
  password?: string;
  apiKey?: string;
  region?: string;
}

export interface CloudConnection {
  id: string;
  name: string;
  provider_type: CloudProvider;
  region?: string;
  status: 'connected' | 'disconnected' | 'error';
  created_at: string;
  last_checked?: string;
  credentials?: Record<string, any>;
}

export interface InstanceSize {
  id: string;
  name: string;
  cpu: number;
  ram: number; // GB
  disk: number; // GB
  price?: number; // USD per hour
}

export interface OSImage {
  id: string;
  name: string;
  os: string;
  version: string;
  arch: string;
}

export interface CloudInstance {
  id: string;
  name: string;
  provider: CloudProvider;
  status: 'running' | 'stopped' | 'pending' | 'terminated';
  size: string;
  image: string;
  region: string;
  publicIp?: string;
  privateIp?: string;
  created: Date;
  tags?: Record<string, string>;
}

export interface InfrastructureConfig {
  provider: CloudProvider;
  name: string;
  size: string;
  image: string;
  region: string;
  network?: string;
  tags?: Record<string, string>;
  startupScript?: string;
}

export interface VMCreateRequest {
  name: string;
  image: string;
  cpu_count?: number;
  memory_mb?: number;
  disk_gb?: number;
  config?: Record<string, any>;
}
