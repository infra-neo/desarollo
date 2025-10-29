import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { InfraNodeData, DeploymentConfig, VMNodeData, ContainerNodeData, ClusterNodeData } from '@/types/nodes';

interface FlowState {
  nodes: Node<InfraNodeData>[];
  edges: Edge[];
  selectedNode: Node<InfraNodeData> | null;
  
  // Actions
  setNodes: (nodes: Node<InfraNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<InfraNodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<InfraNodeData>) => void;
  selectNode: (node: Node<InfraNodeData> | null) => void;
  exportToJSON: () => DeploymentConfig;
  clearWorkspace: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  selectNode: (node) => {
    set({ selectedNode: node });
  },

  exportToJSON: () => {
    const { nodes } = get();
    
    // Find cluster node
    const clusterNode = nodes.find(n => n.data.type === 'cluster');
    let clusterName = 'microcloud-lxd';
    if (clusterNode && clusterNode.data.type === 'cluster') {
      const clusterData = clusterNode.data as ClusterNodeData;
      clusterName = clusterData.clusterName || 'microcloud-lxd';
    }

    // Extract VM and Container nodes
    const resources = nodes
      .filter(n => n.data.type === 'vmTemplate' || n.data.type === 'containerTemplate')
      .map(node => {
        const data = node.data;
        if (data.type === 'vmTemplate') {
          const vmData = data as VMNodeData;
          return {
            type: 'vm' as const,
            name: vmData.name || 'unnamed-vm',
            cpu: vmData.cpu || 2,
            ram: vmData.ram || '4GB',
            disk: vmData.disk || '20GB',
            network: vmData.network || 'default',
            image: vmData.image || 'ubuntu-22.04',
            firewall: vmData.firewall || [],
            user: vmData.user || 'admin',
            replicas: vmData.replicas || 1,
          };
        } else if (data.type === 'containerTemplate') {
          const containerData = data as ContainerNodeData;
          return {
            type: 'container' as const,
            name: containerData.name || 'unnamed-container',
            cpu: containerData.cpu || 1,
            ram: containerData.ram || '2GB',
            network: containerData.network || 'default',
            image: containerData.image || 'ubuntu-22.04',
            firewall: containerData.firewall || [],
            user: containerData.user || 'admin',
            replicas: containerData.replicas || 1,
          };
        }
        return null;
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    return {
      cluster: clusterName,
      resources,
    };
  },

  clearWorkspace: () => {
    set({ nodes: [], edges: [], selectedNode: null });
  },
}));
