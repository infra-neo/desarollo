import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud, Server, HardDrive, Plus, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const cloudProviderInfo = {
  gcp: { name: 'Google Cloud Platform', icon: '🌐', color: 'bg-blue-500' },
  aws: { name: 'Amazon Web Services', icon: '☁️', color: 'bg-orange-500' },
  azure: { name: 'Microsoft Azure', icon: '🔷', color: 'bg-blue-600' },
  lxd: { name: 'LXD / LXC', icon: '📦', color: 'bg-purple-500' },
  microcloud: { name: 'MicroCloud', icon: '☁️', color: 'bg-indigo-500' },
};

export default function CloudsPage() {
  const { cloudConnections } = useWorkspaceStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
                Cloud Connections
              </h1>
              <p className="text-gray-600">
                Manage your multi-cloud and on-premise infrastructure
              </p>
            </div>
            <Link to="/workspace">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Cloud Connection
              </Button>
            </Link>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clouds</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {cloudConnections.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Cloud className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Connections</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {cloudConnections.filter(c => c.connected).length}
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
                  <p className="text-sm font-medium text-gray-600">Total Regions</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {cloudConnections.reduce((acc, c) => acc + (c.regions?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Server className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Cloud Connections Grid */}
          {cloudConnections.length === 0 ? (
            <Card className="p-12 text-center">
              <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Cloud Connections
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by connecting to your cloud providers to manage your infrastructure from a single dashboard
              </p>
              <Link to="/workspace">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Connect Your First Cloud
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cloudConnections.map((connection, index) => {
                const providerInfo = cloudProviderInfo[connection.provider];
                
                return (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredCard(connection.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 ${providerInfo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 ${providerInfo.color} bg-opacity-10 rounded-lg`}>
                              <span className="text-2xl">{providerInfo.icon}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {connection.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {providerInfo.name}
                              </p>
                            </div>
                          </div>
                          
                          {connection.connected ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        
                        {/* Stats */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Server className="w-4 h-4" />
                              Regions
                            </span>
                            <span className="font-medium text-gray-900">
                              {connection.regions?.length || 0}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                              <HardDrive className="w-4 h-4" />
                              Status
                            </span>
                            <span className={`font-medium ${connection.connected ? 'text-green-600' : 'text-red-600'}`}>
                              {connection.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          
                          {connection.lastConnected && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Last Connected</span>
                              <span className="text-gray-900">
                                {new Date(connection.lastConnected).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <Link to={`/clouds/${connection.id}/vms`}>
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:bg-gray-900 group-hover:text-white transition-colors"
                          >
                            View Virtual Machines
                            <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${hoveredCard === connection.id ? 'translate-x-1' : ''}`} />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/machine-registration">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Server className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Register Machine</h3>
                        <p className="text-sm text-gray-600">Add on-premise machines to your infrastructure</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                </Card>
              </Link>
              
              <Link to="/workspace">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Cloud className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Infrastructure Designer</h3>
                        <p className="text-sm text-gray-600">Design and deploy infrastructure visually</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
