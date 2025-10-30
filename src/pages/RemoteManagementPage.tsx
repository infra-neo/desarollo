import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Monitor,
  Server,
  Terminal,
  FolderOpen,
  Plus,
  Search,
  MoreVertical,
  Circle,
  Package,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { remoteManagementService, type RemoteInstance } from '@/services/remoteManagementService';

const osIcons = {
  linux: '🐧',
  windows: '🪟',
  macos: '🍎',
};

const statusColors = {
  online: 'text-green-500',
  offline: 'text-gray-400',
  installing: 'text-yellow-500',
};

export default function RemoteManagementPage() {
  const [instances, setInstances] = useState<RemoteInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    setLoading(true);
    try {
      const data = await remoteManagementService.getInstances();
      setInstances(data);
    } catch (error) {
      toast.error('Failed to load instances');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstances = instances.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.ipAddress.includes(searchQuery)
  );

  const handleStartSession = async (
    instance: RemoteInstance,
    type: 'ssh' | 'rdp' | 'html5' | 'file-manager'
  ) => {
    try {
      await remoteManagementService.startRemoteSession(instance.id, type);
      
      let url = '';
      switch (type) {
        case 'ssh':
          url = remoteManagementService.getTerminalUrl(instance.id);
          break;
        case 'file-manager':
          url = remoteManagementService.getFileManagerUrl(instance.id);
          break;
        case 'html5':
        case 'rdp':
          url = remoteManagementService.getRemoteDesktopUrl(instance.id);
          break;
      }
      
      toast.success(`Starting ${type.toUpperCase()} session...`);
      window.open(url, '_blank');
    } catch (error) {
      toast.error(`Failed to start ${type} session`);
    }
  };

  const stats = {
    total: instances.length,
    online: instances.filter((i) => i.status === 'online').length,
    linux: instances.filter((i) => i.os === 'linux').length,
    windows: instances.filter((i) => i.os === 'windows').length,
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
                Remote Management
              </h1>
              <p className="text-gray-600">
                Manage and access your infrastructure remotely
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/workspace">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New VM
                </Button>
              </Link>
              <Link to="/remote/connect">
                <Button className="gap-2">
                  <Server className="w-4 h-4" />
                  Connect Existing Machine
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Server className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Instances</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Circle className="w-8 h-8 text-green-600 fill-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.online}</div>
                  <div className="text-sm text-gray-600">Online</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐧</span>
                <div>
                  <div className="text-2xl font-bold">{stats.linux}</div>
                  <div className="text-sm text-gray-600">Linux</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🪟</span>
                <div>
                  <div className="text-2xl font-bold">{stats.windows}</div>
                  <div className="text-sm text-gray-600">Windows</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instances by name or IP..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Instances Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInstances.map((instance) => (
              <motion.div
                key={instance.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{osIcons[instance.os]}</div>
                      <div>
                        <h3 className="text-lg font-semibold">{instance.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Circle
                            className={`w-3 h-3 ${statusColors[instance.status]} fill-current`}
                          />
                          <span>{instance.status}</span>
                          <span>•</span>
                          <span>{instance.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Installed Apps */}
                  {instance.installedApps && instance.installedApps.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">
                          {instance.installedApps.length} Application(s)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {instance.installedApps.map((app) => (
                          <div
                            key={app.id}
                            className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs"
                          >
                            <Circle
                              className={`w-2 h-2 ${
                                app.status === 'running'
                                  ? 'text-green-500 fill-green-500'
                                  : 'text-gray-400 fill-gray-400'
                              }`}
                            />
                            <span>{app.name}</span>
                            {app.url && (
                              <a
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1"
                              >
                                <ExternalLink className="w-3 h-3 text-blue-600" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {instance.sshEnabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartSession(instance, 'ssh')}
                        className="gap-2"
                      >
                        <Terminal className="w-4 h-4" />
                        SSH Terminal
                      </Button>
                    )}
                    {instance.websoft9Features?.fileManager && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartSession(instance, 'file-manager')}
                        className="gap-2"
                      >
                        <FolderOpen className="w-4 h-4" />
                        File Manager
                      </Button>
                    )}
                    {instance.html5Enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartSession(instance, 'html5')}
                        className="gap-2"
                      >
                        <Monitor className="w-4 h-4" />
                        Remote Desktop
                      </Button>
                    )}
                    <Link to={`/remote/${instance.id}/apps`}>
                      <Button variant="outline" size="sm" className="gap-2 w-full">
                        <Package className="w-4 h-4" />
                        App Store
                      </Button>
                    </Link>
                  </div>

                  {/* Feature Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {instance.websoft9Features && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        Websoft9
                      </span>
                    )}
                    {instance.remotelyFeatures?.unattendedAccess && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        Unattended Access
                      </span>
                    )}
                    {instance.remotelyFeatures?.fileTransfer && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                        File Transfer
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && filteredInstances.length === 0 && (
            <div className="text-center py-12">
              <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No instances found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Get started by creating a new VM or connecting an existing machine'}
              </p>
              <div className="flex gap-2 justify-center">
                <Link to="/workspace">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New VM
                  </Button>
                </Link>
                <Link to="/remote/connect">
                  <Button variant="outline">
                    <Server className="w-4 h-4 mr-2" />
                    Connect Existing
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
