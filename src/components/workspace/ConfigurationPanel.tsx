import { useWorkspaceStore, type BlockConfig } from '@/stores/workspaceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ConfigurationPanel() {
  const { selectedNode, updateNode, deleteNode, setSelectedNode } = useWorkspaceStore();
  const [config, setConfig] = useState<BlockConfig>({ name: '' });

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config);
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSave = () => {
    updateNode(selectedNode.id, config);
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
    setSelectedNode(null);
  };

  const handleChange = (field: keyof BlockConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const renderFields = () => {
    const type = selectedNode.data.type;

    switch (type) {
      case 'vm':
        return (
          <>
            <div>
              <Label htmlFor="cpu">CPU Cores</Label>
              <Input
                id="cpu"
                type="number"
                value={config.cpu || 1}
                onChange={(e) => handleChange('cpu', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="ram">RAM (GB)</Label>
              <Input
                id="ram"
                type="number"
                value={config.ram || 1}
                onChange={(e) => handleChange('ram', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="disk">Disk (GB)</Label>
              <Input
                id="disk"
                type="number"
                value={config.disk || 10}
                onChange={(e) => handleChange('disk', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="os">Operating System</Label>
              <Input
                id="os"
                value={config.os || ''}
                onChange={(e) => handleChange('os', e.target.value)}
                placeholder="e.g., Ubuntu 22.04"
              />
            </div>
            <div>
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                value={config.ip || ''}
                onChange={(e) => handleChange('ip', e.target.value)}
                placeholder="e.g., 192.168.1.10"
              />
            </div>
            <div>
              <Label htmlFor="gateway">Gateway</Label>
              <Input
                id="gateway"
                value={config.gateway || ''}
                onChange={(e) => handleChange('gateway', e.target.value)}
                placeholder="e.g., 192.168.1.1"
              />
            </div>
          </>
        );

      case 'user':
        return (
          <>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={config.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="assignedRole">Assigned Role</Label>
              <Input
                id="assignedRole"
                value={config.assignedRole || ''}
                onChange={(e) => handleChange('assignedRole', e.target.value)}
              />
            </div>
          </>
        );

      case 'firewall':
        return (
          <>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={config.port || ''}
                onChange={(e) => handleChange('port', e.target.value)}
                placeholder="e.g., 80, 443, 8080"
              />
            </div>
            <div>
              <Label htmlFor="protocol">Protocol</Label>
              <Input
                id="protocol"
                value={config.protocol || ''}
                onChange={(e) => handleChange('protocol', e.target.value)}
                placeholder="e.g., TCP, UDP"
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={config.source || ''}
                onChange={(e) => handleChange('source', e.target.value)}
                placeholder="e.g., 0.0.0.0/0"
              />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={config.destination || ''}
                onChange={(e) => handleChange('destination', e.target.value)}
                placeholder="e.g., 192.168.1.0/24"
              />
            </div>
          </>
        );

      case 'cloud':
        return (
          <>
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={config.provider || ''}
                onChange={(e) => handleChange('provider', e.target.value)}
                placeholder="e.g., GCP, AWS, Azure"
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={config.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
                placeholder="e.g., us-central1"
              />
            </div>
          </>
        );

      case 'network':
        return (
          <>
            <div>
              <Label htmlFor="subnet">Subnet</Label>
              <Input
                id="subnet"
                value={config.subnet || ''}
                onChange={(e) => handleChange('subnet', e.target.value)}
                placeholder="e.g., 192.168.1.0/24"
              />
            </div>
            <div>
              <Label htmlFor="vlan">VLAN</Label>
              <Input
                id="vlan"
                value={config.vlan || ''}
                onChange={(e) => handleChange('vlan', e.target.value)}
                placeholder="e.g., 100"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Configure Block</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedNode(null)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={config.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter a name"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={config.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter a description"
            rows={3}
          />
        </div>

        {renderFields()}

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <strong>Type:</strong> {selectedNode.data.type}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          <strong>ID:</strong> {selectedNode.id}
        </div>
      </div>
    </div>
  );
}
