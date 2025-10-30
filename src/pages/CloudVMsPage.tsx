import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Server, 
  ArrowLeft, 
  Search, 
  Play, 
  Square, 
  RefreshCw,
  MoreVertical,
  Activity,
  HardDrive,
  Cpu,
  Database,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createConnector } from '@/services/connectors/cloudConnector';

// Mock VM data structure
interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'pending' | 'terminated';
  region: string;
  instanceType: string;
  publicIp?: string;
  privateIp?: string;
  cpu: number;
  ram: number;
  disk: number;
  os: string;
  created: Date;
  uptime?: string;
}

const mockVMs: VirtualMachine[] = [
  {
    id: 'vm-1',
    name: 'web-server-01',
    status: 'running',
    region: 'us-central1',
    instanceType: 'n2-standard-2',
    publicIp: '34.123.45.67',
    privateIp: '10.0.1.10',
    cpu: 2,
    ram: 8,
    disk: 50,
    os: 'Ubuntu 22.04 LTS',
    created: new Date('2025-01-15'),
    uptime: '45 days'
  },
  {
    id: 'vm-2',
    name: 'database-primary',
    status: 'running',
    region: 'us-central1',
    instanceType: 'n2-highmem-4',
    publicIp: '34.123.45.68',
    privateIp: '10.0.1.11',
    cpu: 4,
    ram: 32,
    disk: 200,
    os: 'Ubuntu 22.04 LTS',
    created: new Date('2025-01-10'),
    uptime: '50 days'
  },
  {
    id: 'vm-3',
    name: 'api-gateway',
    status: 'stopped',
    region: 'us-east1',
    instanceType: 'n2-standard-1',
    privateIp: '10.0.2.10',
    cpu: 1,
    ram: 4,
    disk: 30,
    os: 'Debian 11',
    created: new Date('2025-02-01'),
  },
];

const statusColors = {
  running: 'bg-green-100 text-green-800',
  stopped: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  terminated: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  running: Activity,
  stopped: Square,
  pending: RefreshCw,
  terminated: Square,
};

export default function CloudVMsPage() {
  const { cloudId } = useParams();
  const { cloudConnections } = useWorkspaceStore();
  const [vms, setVms] = useState<VirtualMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const cloudConnection = cloudConnections.find(c => c.id === cloudId);

  useEffect(() => {
    // Simulate loading VMs from the cloud provider
    const loadVMs = async () => {
      setLoading(true);
      
      if (cloudConnection) {
        // In real implementation, fetch VMs from the cloud provider API
        const connector = createConnector(cloudConnection.provider);
        await connector.connect({
          provider: cloudConnection.provider,
        });
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVms(mockVMs);
      }
      
      setLoading(false);
    };

    loadVMs();
  }, [cloudConnection]);

  const filteredVMs = vms.filter(vm => {
    const matchesSearch = vm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vm.publicIp?.includes(searchQuery) ||
                         vm.privateIp?.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || vm.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (!cloudConnection) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cloud Not Found</h2>
          <Link to="/clouds">
            <Button>Back to Clouds</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Link to="/clouds">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {cloudConnection.name}
                </h1>
                <p className="text-gray-600">
                  Virtual Machines - {cloudConnection.provider.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total VMs</p>
                    <p className="text-2xl font-bold text-gray-900">{vms.length}</p>
                  </div>
                  <Server className="w-8 h-8 text-blue-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Running</p>
                    <p className="text-2xl font-bold text-green-600">
                      {vms.filter(vm => vm.status === 'running').length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Stopped</p>
                    <p className="text-2xl font-bold text-red-600">
                      {vms.filter(vm => vm.status === 'stopped').length}
                    </p>
                  </div>
                  <Square className="w-8 h-8 text-red-600" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total vCPUs</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {vms.reduce((acc, vm) => acc + vm.cpu, 0)}
                    </p>
                  </div>
                  <Cpu className="w-8 h-8 text-purple-600" />
                </div>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, IP address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                  <option value="pending">Pending</option>
                </select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gray-100' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </motion.div>

          {/* VMs Display */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredVMs.length === 0 ? (
            <Card className="p-12 text-center">
              <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Virtual Machines Found
              </h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search criteria' : 'No VMs in this cloud connection'}
              </p>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVMs.map((vm, index) => {
                const StatusIcon = statusIcons[vm.status];
                
                return (
                  <motion.div
                    key={vm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Server className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{vm.name}</h3>
                            <p className="text-sm text-gray-600">{vm.instanceType}</p>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[vm.status]}`}>
                            <StatusIcon className="w-3 h-3" />
                            {vm.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            CPU
                          </span>
                          <span className="font-medium">{vm.cpu} vCPUs</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            RAM
                          </span>
                          <span className="font-medium">{vm.ram} GB</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            Disk
                          </span>
                          <span className="font-medium">{vm.disk} GB</span>
                        </div>
                        
                        {vm.publicIp && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Public IP</span>
                            <span className="font-mono text-xs">{vm.publicIp}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Region</span>
                          <span className="font-medium">{vm.region}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          disabled={vm.status === 'running'}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          disabled={vm.status === 'stopped'}
                        >
                          <Square className="w-3 h-3 mr-1" />
                          Stop
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instance Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resources
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVMs.map((vm) => {
                      const StatusIcon = statusIcons[vm.status];
                      
                      return (
                        <tr key={vm.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Server className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{vm.name}</div>
                                <div className="text-sm text-gray-500">{vm.os}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusColors[vm.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {vm.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {vm.instanceType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vm.cpu} vCPU, {vm.ram} GB RAM, {vm.disk} GB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {vm.publicIp && (
                              <div className="font-mono text-xs mb-1">{vm.publicIp}</div>
                            )}
                            <div className="font-mono text-xs text-gray-500">{vm.privateIp}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vm.region}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" disabled={vm.status === 'running'}>
                                <Play className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" disabled={vm.status === 'stopped'}>
                                <Square className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
