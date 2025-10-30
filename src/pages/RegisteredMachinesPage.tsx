import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Server, 
  Search, 
  RefreshCw,
  Trash2,
  Edit,
  MoreVertical,
  Activity,
  CheckCircle2,
  XCircle,
  Monitor,
  Terminal,
  Apple,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useMachines, useDeleteMachine, useMachineStats } from '@/hooks/useHeadscale';
import { useState } from 'react';

const osIcons = {
  'Windows': Monitor,
  'Linux': Terminal,
  'macOS': Apple,
  'Unknown': Server,
};

export default function RegisteredMachinesPage() {
  const { data: machines, isLoading, refetch } = useMachines();
  const { stats } = useMachineStats();
  const deleteMachine = useDeleteMachine();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMachines = machines?.filter(machine =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.ipAddress.includes(searchQuery) ||
    machine.user.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async (machineId: string, machineName: string) => {
    if (window.confirm(`Are you sure you want to delete ${machineName}? This action cannot be undone.`)) {
      await deleteMachine.mutateAsync(machineId);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            className="flex justify-between items-end mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text card-gradient">
                Registered Machines
              </h1>
              <p className="text-gray-600">
                On-premise machines connected via Headscale VPN
              </p>
            </div>
            <Link to="/machine-registration">
              <Button className="gap-2">
                <Server className="w-4 h-4" />
                Register New Machine
              </Button>
            </Link>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Machines</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Server className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {stats.connected}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disconnected</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {stats.disconnected}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platforms</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {Object.keys(stats.byOS).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, IP, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Machines List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredMachines.length === 0 ? (
            <Card className="p-12 text-center">
              <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Registered Machines
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'No machines match your search criteria' 
                  : 'Register your first on-premise machine to get started'}
              </p>
              {!searchQuery && (
                <Link to="/machine-registration">
                  <Button className="gap-2">
                    <Server className="w-4 h-4" />
                    Register Machine
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Machine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Seen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMachines.map((machine, index) => {
                      const OSIcon = osIcons[machine.os as keyof typeof osIcons] || Server;
                      
                      return (
                        <motion.tr
                          key={machine.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <OSIcon className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {machine.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {machine.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {machine.status === 'connected' ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit bg-green-100 text-green-800">
                                <Activity className="w-3 h-3" />
                                Connected
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3" />
                                Disconnected
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono text-sm text-gray-900">
                              {machine.ipAddress}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {machine.os}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {machine.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(machine.lastSeen).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement edit functionality
                                  console.log('Edit machine:', machine.id);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(machine.id, machine.name)}
                                disabled={deleteMachine.isPending}
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
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
