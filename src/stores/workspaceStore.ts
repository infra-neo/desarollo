import { create } from 'zustand';
import type { Node, Edge, Connection } from 'reactflow';
import { addEdge } from 'reactflow';

export type BlockType = 
  | 'cloud' 
  | 'hypervisor' 
  | 'vm' 
  | 'container' 
  | 'app' 
  | 'user' 
  | 'role' 
  | 'network' 
  | 'firewall';

export interface BlockConfig {
  // VM Configuration
  cpu?: number;
  ram?: number;
  disk?: number;
  os?: string;
  ip?: string;
  gateway?: string;
  
  // User Configuration
  username?: string;
  email?: string;
  assignedRole?: string;
  assignedApps?: string[];
  
  // Firewall Configuration
  port?: string;
  protocol?: string;
  source?: string;
  destination?: string;
  
  // Cloud Configuration
  provider?: string;
  region?: string;
  
  // Network Configuration
  subnet?: string;
  vlan?: string;
  
  // Common
  name: string;
  description?: string;
}

export interface WorkspaceNode extends Node {
  data: {
    label: string;
    type: BlockType;
    config: BlockConfig;
  };
}

interface WorkspaceState {
  nodes: WorkspaceNode[];
  edges: Edge[];
  selectedNode: WorkspaceNode | null;
  addNode: (node: WorkspaceNode) => void;
  updateNode: (id: string, config: BlockConfig) => void;
  deleteNode: (id: string) => void;
  setNodes: (nodes: WorkspaceNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: WorkspaceNode | null) => void;
  exportBlueprint: () => string;
  validateWorkspace: () => { isValid: boolean; errors: string[] };
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (id, config) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      ),
      selectedNode:
        state.selectedNode?.id === id
          ? { ...state.selectedNode, data: { ...state.selectedNode.data, config: { ...state.selectedNode.data.config, ...config } } }
          : state.selectedNode,
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
    }));
  },

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    const { nodes } = get();
    const updatedNodes = changes.reduce((acc: WorkspaceNode[], change: any) => {
      if (change.type === 'position' && change.position) {
        return acc.map((node) =>
          node.id === change.id ? { ...node, position: change.position } : node
        );
      }
      if (change.type === 'remove') {
        return acc.filter((node) => node.id !== change.id);
      }
      return acc;
    }, nodes);
    set({ nodes: updatedNodes });
  },

  onEdgesChange: (changes) => {
    const { edges } = get();
    const updatedEdges = changes.reduce((acc: Edge[], change: any) => {
      if (change.type === 'remove') {
        return acc.filter((edge) => edge.id !== change.id);
      }
      return acc;
    }, edges);
    set({ edges: updatedEdges });
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }));
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  exportBlueprint: () => {
    const { nodes, edges } = get();
    const blueprint = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        config: node.data.config,
        position: node.position,
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
    };
    return JSON.stringify(blueprint, null, 2);
  },

  validateWorkspace: () => {
    const { nodes, edges } = get();
    const errors: string[] = [];

    // Validate that apps are connected to VMs
    const appNodes = nodes.filter((n) => n.data.type === 'app');
    appNodes.forEach((app) => {
      const hasVMConnection = edges.some(
        (edge) => edge.target === app.id && nodes.find((n) => n.id === edge.source && n.data.type === 'vm')
      );
      if (!hasVMConnection) {
        errors.push(`App "${app.data.config.name}" must be connected to a VM`);
      }
    });

    // Validate that VMs are connected to networks
    const vmNodes = nodes.filter((n) => n.data.type === 'vm');
    vmNodes.forEach((vm) => {
      const hasNetworkConnection = edges.some(
        (edge) => edge.source === vm.id && nodes.find((n) => n.id === edge.target && n.data.type === 'network')
      );
      if (!hasNetworkConnection && vmNodes.length > 0) {
        errors.push(`VM "${vm.data.config.name}" should be connected to a network`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
}));
