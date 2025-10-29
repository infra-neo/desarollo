import { Card } from '@/components/ui/card';
import { nodePalette } from '@/flows/nodePalette';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Group nodes by category
  const groupedNodes = nodePalette.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, typeof nodePalette>);

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6">Infrastructure Blocks</h2>
      
      <div className="space-y-6">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {category}
            </h3>
            <div className="space-y-2">
              {nodes.map((node) => {
                const Icon = node.icon;
                return (
                  <Card
                    key={node.type}
                    className="p-3 cursor-move hover:bg-slate-800 transition-colors border-slate-700 bg-slate-800/50"
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {node.label}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
