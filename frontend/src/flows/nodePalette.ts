import { NodeType } from '@/types/nodes';
import { 
  Server, 
  Box, 
  Container, 
  HardDrive, 
  Network, 
  Shield, 
  Users, 
  TrendingUp,
  Layers
} from 'lucide-react';

export interface NodePaletteItem {
  type: NodeType;
  label: string;
  icon: typeof Server;
  description: string;
  category: string;
}

export const nodePalette: NodePaletteItem[] = [
  {
    type: 'cluster',
    label: 'Cluster',
    icon: Layers,
    description: 'MicroCloud LXD Cluster',
    category: 'Infrastructure',
  },
  {
    type: 'nodeGroup',
    label: 'Node Group',
    icon: Server,
    description: 'Group of compute nodes',
    category: 'Infrastructure',
  },
  {
    type: 'vmTemplate',
    label: 'VM Template',
    icon: Box,
    description: 'Virtual Machine configuration',
    category: 'Compute',
  },
  {
    type: 'containerTemplate',
    label: 'Container Template',
    icon: Container,
    description: 'Container configuration',
    category: 'Compute',
  },
  {
    type: 'imageStore',
    label: 'Image Store',
    icon: HardDrive,
    description: 'OS image repository',
    category: 'Storage',
  },
  {
    type: 'networkConfig',
    label: 'Network Config',
    icon: Network,
    description: 'Network configuration',
    category: 'Networking',
  },
  {
    type: 'firewallPolicies',
    label: 'Firewall Policies',
    icon: Shield,
    description: 'Security rules',
    category: 'Security',
  },
  {
    type: 'usersRoles',
    label: 'Users / Roles',
    icon: Users,
    description: 'Access control',
    category: 'Security',
  },
  {
    type: 'scalingRules',
    label: 'Scaling Rules',
    icon: TrendingUp,
    description: 'Auto-scaling configuration',
    category: 'Operations',
  },
];
