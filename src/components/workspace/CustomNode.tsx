import { Handle, Position } from 'reactflow';
import type { BlockType } from '@/stores/workspaceStore';
import { 
  Cloud, 
  Server, 
  HardDrive, 
  Package, 
  User, 
  Shield, 
  Network, 
  Lock 
} from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
    type: BlockType;
    config: {
      name: string;
      description?: string;
    };
  };
  selected?: boolean;
}

const iconMap: Record<BlockType, any> = {
  cloud: Cloud,
  hypervisor: Server,
  vm: HardDrive,
  container: Package,
  app: Package,
  user: User,
  role: Shield,
  network: Network,
  firewall: Lock,
};

const colorMap: Record<BlockType, string> = {
  cloud: 'bg-blue-100 border-blue-400 text-blue-700',
  hypervisor: 'bg-purple-100 border-purple-400 text-purple-700',
  vm: 'bg-green-100 border-green-400 text-green-700',
  container: 'bg-cyan-100 border-cyan-400 text-cyan-700',
  app: 'bg-orange-100 border-orange-400 text-orange-700',
  user: 'bg-pink-100 border-pink-400 text-pink-700',
  role: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  network: 'bg-indigo-100 border-indigo-400 text-indigo-700',
  firewall: 'bg-red-100 border-red-400 text-red-700',
};

export default function CustomNode({ data, selected }: CustomNodeProps) {
  const Icon = iconMap[data.type];
  const colorClass = colorMap[data.type];

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px] shadow-md
        ${colorClass}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        transition-all hover:shadow-lg
      `}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.config.name}</div>
          {data.config.description && (
            <div className="text-xs opacity-75 truncate max-w-[120px]">
              {data.config.description}
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
