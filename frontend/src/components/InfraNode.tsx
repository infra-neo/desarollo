import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { InfraNodeData } from '@/types/nodes';
import { nodePalette } from '@/flows/nodePalette';
import { Card } from '@/components/ui/card';

export default memo(({ data, selected }: NodeProps<InfraNodeData>) => {
  const nodeConfig = nodePalette.find(n => n.type === data.type);
  const Icon = nodeConfig?.icon;

  return (
    <Card
      className={`px-4 py-3 min-w-[200px] transition-all ${
        selected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-slate-700 hover:border-slate-600'
      } bg-slate-800`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-blue-500"
      />
      
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm font-medium text-white">
            {data.label}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {nodeConfig?.label || data.type}
          </div>
        </div>
      </div>

      {/* Show additional info for specific node types */}
      {data.type === 'vmTemplate' && 'name' in data && data.name && (
        <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-300">
          {data.name}
        </div>
      )}
      {data.type === 'containerTemplate' && 'name' in data && data.name && (
        <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-300">
          {data.name}
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-blue-500"
      />
    </Card>
  );
});
