export type NodeType = 
  | 'cluster'
  | 'nodeGroup'
  | 'vmTemplate'
  | 'containerTemplate'
  | 'imageStore'
  | 'networkConfig'
  | 'firewallPolicies'
  | 'usersRoles'
  | 'scalingRules';

export interface BaseNodeData {
  label: string;
  type: NodeType;
}

export interface ClusterNodeData extends BaseNodeData {
  type: 'cluster';
  clusterName: string;
}

export interface VMNodeData extends BaseNodeData {
  type: 'vmTemplate';
  name: string;
  cpu: number;
  ram: string;
  disk: string;
  network: string;
  image: string;
  firewall: string[];
  user: string;
  replicas: number;
}

export interface ContainerNodeData extends BaseNodeData {
  type: 'containerTemplate';
  name: string;
  cpu: number;
  ram: string;
  network: string;
  image: string;
  firewall: string[];
  user: string;
  replicas: number;
}

export interface NetworkConfigData extends BaseNodeData {
  type: 'networkConfig';
  name: string;
  subnet: string;
  gateway: string;
  dhcp: boolean;
}

export interface FirewallPolicyData extends BaseNodeData {
  type: 'firewallPolicies';
  name: string;
  rules: string[];
}

export type InfraNodeData = 
  | ClusterNodeData 
  | VMNodeData 
  | ContainerNodeData 
  | NetworkConfigData 
  | FirewallPolicyData
  | BaseNodeData;

export interface DeploymentConfig {
  cluster: string;
  resources: Array<{
    type: 'vm' | 'container';
    name: string;
    cpu: number;
    ram: string;
    disk?: string;
    network: string;
    image: string;
    firewall: string[];
    user: string;
    replicas: number;
  }>;
}
