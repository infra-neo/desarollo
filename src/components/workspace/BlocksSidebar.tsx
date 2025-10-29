import type { BlockType } from '@/stores/workspaceStore';
import { 
  Cloud, 
  Server, 
  HardDrive, 
  Package, 
  User, 
  Shield, 
  Network, 
  Lock,
  Box
} from 'lucide-react';

interface BlockItem {
  type: BlockType;
  label: string;
  icon: any;
  description: string;
}

const blocks: BlockItem[] = [
  { type: 'cloud', label: 'Cloud', icon: Cloud, description: 'Cloud provider (GCP, AWS, Azure)' },
  { type: 'hypervisor', label: 'Hypervisor', icon: Server, description: 'LXD, VMware, KVM' },
  { type: 'vm', label: 'Virtual Machine', icon: HardDrive, description: 'VM Instance' },
  { type: 'container', label: 'Container', icon: Box, description: 'Docker Container' },
  { type: 'app', label: 'Application', icon: Package, description: 'Application or Service' },
  { type: 'user', label: 'User', icon: User, description: 'User Account' },
  { type: 'role', label: 'Role', icon: Shield, description: 'Access Role' },
  { type: 'network', label: 'Network', icon: Network, description: 'Network Configuration' },
  { type: 'firewall', label: 'Firewall', icon: Lock, description: 'Firewall Rules' },
];

interface BlocksSidebarProps {
  onDragStart: (event: React.DragEvent, blockType: BlockType) => void;
}

export default function BlocksSidebar({ onDragStart }: BlocksSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Infrastructure Blocks</h2>
      <div className="space-y-2">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.type}
              draggable
              onDragStart={(e) => onDragStart(e, block.type)}
              className="
                flex items-start gap-3 p-3 rounded-lg border border-gray-200
                bg-gray-50 hover:bg-gray-100 hover:border-gray-300
                cursor-grab active:cursor-grabbing
                transition-all
              "
            >
              <Icon className="w-5 h-5 mt-0.5 text-gray-600" />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-800">{block.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{block.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">How to use</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Drag blocks to the canvas</li>
          <li>• Click to configure properties</li>
          <li>• Connect blocks by dragging between handles</li>
          <li>• Use Validate to check configuration</li>
        </ul>
      </div>
    </div>
  );
}
