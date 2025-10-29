import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '@/state/flowStore';
import InfraNode from '@/components/InfraNode';
import { InfraNodeData, NodeType } from '@/types/nodes';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Trash2, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { useState } from 'react';

const nodeTypes = {
  infraNode: InfraNode,
};

function WorkspaceContent() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode,
    selectNode,
    exportToJSON,
    clearWorkspace
  } = useFlowStore();
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string>('');
  const [planData, setPlanData] = useState<string>('');

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      
      if (!type || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 20,
      };

      const newNode: Node<InfraNodeData> = {
        id: `${type}-${Date.now()}`,
        type: 'infraNode',
        position,
        data: {
          label: `New ${type}`,
          type,
          ...(type === 'vmTemplate' && {
            name: '',
            cpu: 2,
            ram: '4GB',
            disk: '20GB',
            network: 'default',
            image: 'ubuntu-22.04',
            firewall: [],
            user: 'admin',
            replicas: 1,
          }),
          ...(type === 'containerTemplate' && {
            name: '',
            cpu: 1,
            ram: '2GB',
            network: 'default',
            image: 'ubuntu-22.04',
            firewall: [],
            user: 'admin',
            replicas: 1,
          }),
          ...(type === 'cluster' && {
            clusterName: 'microcloud-lxd',
          }),
          ...(type === 'networkConfig' && {
            name: '',
            subnet: '',
            gateway: '',
            dhcp: true,
          }),
          ...(type === 'firewallPolicies' && {
            name: '',
            rules: [],
          }),
        },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node<InfraNodeData>) => {
    selectNode(node);
  }, [selectNode]);

  const handleExportJSON = () => {
    const config = exportToJSON();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'infrastructure-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewJSON = () => {
    setJsonDialogOpen(true);
  };

  const handleGetPlan = async () => {
    try {
      const config = exportToJSON();
      const response = await axios.post('/api/plan', config);
      setPlanData(response.data.plan || JSON.stringify(response.data, null, 2));
    } catch (error) {
      setPlanData(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeploy = async () => {
    try {
      setDeployStatus('Deploying...');
      const config = exportToJSON();
      const response = await axios.post('/api/deploy', config);
      setDeployStatus(`Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setDeployStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
      >
        <Background className="bg-slate-950" color="#334155" gap={16} />
        <Controls className="bg-slate-800 border-slate-700" />
        <MiniMap 
          className="bg-slate-800 border-slate-700"
          nodeColor={() => '#3b82f6'}
        />
        <Panel position="top-right" className="space-x-2">
          <Button
            onClick={handleViewJSON}
            variant="secondary"
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 text-white"
          >
            <FileJson className="w-4 h-4 mr-2" />
            View JSON
          </Button>
          <Button
            onClick={handleExportJSON}
            variant="secondary"
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleGetPlan}
            variant="secondary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Plan
          </Button>
          <Button
            onClick={handleDeploy}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Deploy
          </Button>
          <Button
            onClick={clearWorkspace}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </Panel>
      </ReactFlow>

      {/* JSON Preview Dialog */}
      <Dialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Infrastructure Configuration JSON</DialogTitle>
            <DialogDescription className="text-slate-400">
              This is the configuration that will be sent to the deployment backend
            </DialogDescription>
          </DialogHeader>
          <pre className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96 text-sm border border-slate-700">
            {JSON.stringify(exportToJSON(), null, 2)}
          </pre>
        </DialogContent>
      </Dialog>

      {/* Plan Dialog */}
      {planData && (
        <Dialog open={!!planData} onOpenChange={() => setPlanData('')}>
          <DialogContent className="max-w-2xl bg-slate-800 text-white border-slate-700">
            <DialogHeader>
              <DialogTitle>Deployment Plan</DialogTitle>
              <DialogDescription className="text-slate-400">
                Summary of actions that will be performed
              </DialogDescription>
            </DialogHeader>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96 text-sm border border-slate-700">
              {planData}
            </pre>
          </DialogContent>
        </Dialog>
      )}

      {/* Deploy Status Dialog */}
      {deployStatus && (
        <Dialog open={!!deployStatus} onOpenChange={() => setDeployStatus('')}>
          <DialogContent className="max-w-2xl bg-slate-800 text-white border-slate-700">
            <DialogHeader>
              <DialogTitle>Deployment Status</DialogTitle>
            </DialogHeader>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96 text-sm border border-slate-700">
              {deployStatus}
            </pre>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function Workspace() {
  return (
    <ReactFlowProvider>
      <WorkspaceContent />
    </ReactFlowProvider>
  );
}
