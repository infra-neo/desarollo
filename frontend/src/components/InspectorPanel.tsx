import { useFlowStore } from '@/state/flowStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function InspectorPanel() {
  const { selectedNode, updateNodeData, selectNode } = useFlowStore();

  if (!selectedNode) {
    return (
      <div className="w-96 bg-slate-900 border-l border-slate-800 p-4">
        <div className="flex items-center justify-center h-full text-slate-500">
          <p className="text-sm">Select a node to edit properties</p>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    selectNode(null);
  };

  const handleInputChange = (field: string, value: string | number | string[]) => {
    updateNodeData(selectedNode.id, { [field]: value } as any);
  };

  const renderFields = () => {
    const { data } = selectedNode;

    // Common fields for all nodes
    const commonFields = (
      <div className="space-y-4">
        <div>
          <Label htmlFor="label" className="text-slate-300">Label</Label>
          <Input
            id="label"
            value={data.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className="bg-slate-800 border-slate-700 text-white mt-1"
          />
        </div>
      </div>
    );

    // Specific fields based on node type
    switch (data.type) {
      case 'cluster':
        return (
          <>
            {commonFields}
            <div className="mt-4">
              <Label htmlFor="clusterName" className="text-slate-300">Cluster Name</Label>
              <Input
                id="clusterName"
                value={'clusterName' in data ? data.clusterName : ''}
                onChange={(e) => handleInputChange('clusterName', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-1"
                placeholder="microcloud-lxd"
              />
            </div>
          </>
        );

      case 'vmTemplate':
        return (
          <>
            {commonFields}
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">VM Name</Label>
                <Input
                  id="name"
                  value={'name' in data ? data.name : ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="my-vm"
                />
              </div>
              <div>
                <Label htmlFor="cpu" className="text-slate-300">CPU Cores</Label>
                <Input
                  id="cpu"
                  type="number"
                  value={'cpu' in data ? data.cpu : 2}
                  onChange={(e) => handleInputChange('cpu', parseInt(e.target.value) || 2)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  min="1"
                  max="32"
                />
              </div>
              <div>
                <Label htmlFor="ram" className="text-slate-300">RAM (GB)</Label>
                <Input
                  id="ram"
                  value={'ram' in data ? data.ram : '4GB'}
                  onChange={(e) => handleInputChange('ram', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="8GB"
                />
              </div>
              <div>
                <Label htmlFor="disk" className="text-slate-300">Disk (GB)</Label>
                <Input
                  id="disk"
                  value={'disk' in data ? data.disk : '20GB'}
                  onChange={(e) => handleInputChange('disk', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="50GB"
                />
              </div>
              <div>
                <Label htmlFor="network" className="text-slate-300">Network</Label>
                <Input
                  id="network"
                  value={'network' in data ? data.network : 'default'}
                  onChange={(e) => handleInputChange('network', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="internal-net"
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-slate-300">Image</Label>
                <Select
                  value={'image' in data ? data.image : 'ubuntu-22.04'}
                  onValueChange={(value) => handleInputChange('image', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                    <SelectValue placeholder="Select image" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="ubuntu-22.04">Ubuntu 22.04</SelectItem>
                    <SelectItem value="ubuntu-20.04">Ubuntu 20.04</SelectItem>
                    <SelectItem value="debian-12">Debian 12</SelectItem>
                    <SelectItem value="centos-stream-9">CentOS Stream 9</SelectItem>
                    <SelectItem value="win11-base">Windows 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user" className="text-slate-300">User</Label>
                <Input
                  id="user"
                  value={'user' in data ? data.user : 'admin'}
                  onChange={(e) => handleInputChange('user', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="adminOps"
                />
              </div>
              <div>
                <Label htmlFor="firewall" className="text-slate-300">Firewall Rules (comma-separated)</Label>
                <Input
                  id="firewall"
                  value={'firewall' in data ? data.firewall.join(', ') : ''}
                  onChange={(e) => handleInputChange('firewall', e.target.value.split(',').map(s => s.trim()))}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="ssh, http, https"
                />
              </div>
              <div>
                <Label htmlFor="replicas" className="text-slate-300">Replicas</Label>
                <Input
                  id="replicas"
                  type="number"
                  value={'replicas' in data ? data.replicas : 1}
                  onChange={(e) => handleInputChange('replicas', parseInt(e.target.value) || 1)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </>
        );

      case 'containerTemplate':
        return (
          <>
            {commonFields}
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Container Name</Label>
                <Input
                  id="name"
                  value={'name' in data ? data.name : ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="my-container"
                />
              </div>
              <div>
                <Label htmlFor="cpu" className="text-slate-300">CPU Cores</Label>
                <Input
                  id="cpu"
                  type="number"
                  value={'cpu' in data ? data.cpu : 1}
                  onChange={(e) => handleInputChange('cpu', parseInt(e.target.value) || 1)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  min="1"
                  max="16"
                />
              </div>
              <div>
                <Label htmlFor="ram" className="text-slate-300">RAM (GB)</Label>
                <Input
                  id="ram"
                  value={'ram' in data ? data.ram : '2GB'}
                  onChange={(e) => handleInputChange('ram', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="4GB"
                />
              </div>
              <div>
                <Label htmlFor="network" className="text-slate-300">Network</Label>
                <Input
                  id="network"
                  value={'network' in data ? data.network : 'default'}
                  onChange={(e) => handleInputChange('network', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="internal-net"
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-slate-300">Image</Label>
                <Select
                  value={'image' in data ? data.image : 'ubuntu-22.04'}
                  onValueChange={(value) => handleInputChange('image', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                    <SelectValue placeholder="Select image" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="ubuntu-22.04">Ubuntu 22.04</SelectItem>
                    <SelectItem value="alpine-3.18">Alpine 3.18</SelectItem>
                    <SelectItem value="debian-12">Debian 12</SelectItem>
                    <SelectItem value="nginx">Nginx</SelectItem>
                    <SelectItem value="redis">Redis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user" className="text-slate-300">User</Label>
                <Input
                  id="user"
                  value={'user' in data ? data.user : 'admin'}
                  onChange={(e) => handleInputChange('user', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="adminOps"
                />
              </div>
              <div>
                <Label htmlFor="firewall" className="text-slate-300">Firewall Rules (comma-separated)</Label>
                <Input
                  id="firewall"
                  value={'firewall' in data ? data.firewall.join(', ') : ''}
                  onChange={(e) => handleInputChange('firewall', e.target.value.split(',').map(s => s.trim()))}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="ssh, http"
                />
              </div>
              <div>
                <Label htmlFor="replicas" className="text-slate-300">Replicas</Label>
                <Input
                  id="replicas"
                  type="number"
                  value={'replicas' in data ? data.replicas : 1}
                  onChange={(e) => handleInputChange('replicas', parseInt(e.target.value) || 1)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </>
        );

      case 'networkConfig':
        return (
          <>
            {commonFields}
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Network Name</Label>
                <Input
                  id="name"
                  value={'name' in data ? data.name : ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="internal-net"
                />
              </div>
              <div>
                <Label htmlFor="subnet" className="text-slate-300">Subnet</Label>
                <Input
                  id="subnet"
                  value={'subnet' in data ? data.subnet : ''}
                  onChange={(e) => handleInputChange('subnet', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="192.168.1.0/24"
                />
              </div>
              <div>
                <Label htmlFor="gateway" className="text-slate-300">Gateway</Label>
                <Input
                  id="gateway"
                  value={'gateway' in data ? data.gateway : ''}
                  onChange={(e) => handleInputChange('gateway', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="192.168.1.1"
                />
              </div>
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 overflow-y-auto">
      <Card className="m-4 bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Node Properties</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {renderFields()}
        </CardContent>
      </Card>
    </div>
  );
}
