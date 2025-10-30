import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkspaceStore, type BlockType } from '@/stores/workspaceStore';
import CustomNode from './CustomNode';
import { toast } from 'sonner';

const nodeTypes = {
  custom: CustomNode,
};

interface WorkspaceCanvasProps {
  onNodeClick: (node: any) => void;
}

function WorkspaceCanvasInner({ onNodeClick }: WorkspaceCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
  } = useWorkspaceStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as BlockType;
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 80,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          type,
          config: {
            name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            description: '',
          },
        },
      };

      addNode(newNode);
      toast.success(`Added ${type} block to workspace`);
    },
    [addNode]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node);
      onNodeClick(node);
    },
    [setSelectedNode, onNodeClick]
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
              cloud: '#93c5fd',
              hypervisor: '#c4b5fd',
              vm: '#86efac',
              container: '#a5f3fc',
              app: '#fdba74',
              user: '#f9a8d4',
              role: '#fde047',
              network: '#a5b4fc',
              firewall: '#fca5a5',
            };
            return colorMap[node.data.type] || '#94a3b8';
          }}
          className="!bg-white !border-gray-300"
        />
      </ReactFlow>
    </div>
  );
}

export default function WorkspaceCanvas({ onNodeClick }: WorkspaceCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkspaceCanvasInner onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}
