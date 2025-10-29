import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cloud, Check, Loader2 } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { createConnector, type CloudProvider, type CloudCredentials } from '@/services/connectors/cloudConnector';
import { toast } from 'sonner';

const cloudProviders = [
  { value: 'gcp', label: 'Google Cloud Platform', icon: '🌐' },
  { value: 'aws', label: 'Amazon Web Services', icon: '☁️' },
  { value: 'azure', label: 'Microsoft Azure', icon: '🔷' },
  { value: 'lxd', label: 'LXD / LXC', icon: '📦' },
  { value: 'microcloud', label: 'MicroCloud', icon: '☁️' },
] as const;

export default function CloudConnectionStep() {
  const { addCloudConnection, setCurrentStep, cloudConnections } = useWorkspaceStore();
  const [provider, setProvider] = useState<CloudProvider>('gcp');
  const [connectionName, setConnectionName] = useState('');
  const [connecting, setConnecting] = useState(false);
  
  // Provider-specific credentials
  const [gcpProjectId, setGcpProjectId] = useState('');
  const [gcpKeyFile, setGcpKeyFile] = useState('');
  
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  
  const [azureSubscriptionId, setAzureSubscriptionId] = useState('');
  const [azureClientId, setAzureClientId] = useState('');
  const [azureClientSecret, setAzureClientSecret] = useState('');
  const [azureTenantId, setAzureTenantId] = useState('');
  
  const [lxdEndpoint, setLxdEndpoint] = useState('https://localhost:8443');
  const [lxdCertPath, setLxdCertPath] = useState('');
  const [lxdKeyPath, setLxdKeyPath] = useState('');

  const handleConnect = async () => {
    if (!connectionName.trim()) {
      toast.error('Please enter a connection name');
      return;
    }

    setConnecting(true);
    
    try {
      const connector = createConnector(provider);
      
      const credentials: CloudCredentials = {
        provider,
        projectId: gcpProjectId,
        keyFile: gcpKeyFile,
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        subscriptionId: azureSubscriptionId,
        clientId: azureClientId,
        clientSecret: azureClientSecret,
        tenantId: azureTenantId,
        endpoint: lxdEndpoint,
        certPath: lxdCertPath,
        keyPath: lxdKeyPath,
      };
      
      const success = await connector.connect(credentials);
      
      if (success) {
        const regions = await connector.listRegions();
        
        addCloudConnection({
          id: `${provider}-${Date.now()}`,
          provider,
          name: connectionName,
          connected: true,
          lastConnected: new Date(),
          regions,
        });
        
        toast.success(`Connected to ${connectionName}`, {
          description: `Successfully connected to ${provider.toUpperCase()}`,
        });
        
        // Move to infrastructure step
        setTimeout(() => setCurrentStep('infrastructure'), 500);
      } else {
        toast.error('Connection failed');
      }
    } catch (error) {
      toast.error('Connection error', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setConnecting(false);
    }
  };

  const renderCredentialFields = () => {
    switch (provider) {
      case 'gcp':
        return (
          <>
            <div>
              <Label htmlFor="gcpProjectId">Project ID</Label>
              <Input
                id="gcpProjectId"
                value={gcpProjectId}
                onChange={(e) => setGcpProjectId(e.target.value)}
                placeholder="my-project-id"
              />
            </div>
            <div>
              <Label htmlFor="gcpKeyFile">Service Account Key (JSON)</Label>
              <Input
                id="gcpKeyFile"
                value={gcpKeyFile}
                onChange={(e) => setGcpKeyFile(e.target.value)}
                placeholder="Paste JSON content or file path"
              />
            </div>
          </>
        );
      
      case 'aws':
        return (
          <>
            <div>
              <Label htmlFor="awsAccessKey">Access Key ID</Label>
              <Input
                id="awsAccessKey"
                value={awsAccessKey}
                onChange={(e) => setAwsAccessKey(e.target.value)}
                placeholder="AKIAIOSFODNN7EXAMPLE"
              />
            </div>
            <div>
              <Label htmlFor="awsSecretKey">Secret Access Key</Label>
              <Input
                id="awsSecretKey"
                type="password"
                value={awsSecretKey}
                onChange={(e) => setAwsSecretKey(e.target.value)}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              />
            </div>
          </>
        );
      
      case 'azure':
        return (
          <>
            <div>
              <Label htmlFor="azureSubscriptionId">Subscription ID</Label>
              <Input
                id="azureSubscriptionId"
                value={azureSubscriptionId}
                onChange={(e) => setAzureSubscriptionId(e.target.value)}
                placeholder="12345678-1234-1234-1234-123456789012"
              />
            </div>
            <div>
              <Label htmlFor="azureClientId">Client ID</Label>
              <Input
                id="azureClientId"
                value={azureClientId}
                onChange={(e) => setAzureClientId(e.target.value)}
                placeholder="12345678-1234-1234-1234-123456789012"
              />
            </div>
            <div>
              <Label htmlFor="azureClientSecret">Client Secret</Label>
              <Input
                id="azureClientSecret"
                type="password"
                value={azureClientSecret}
                onChange={(e) => setAzureClientSecret(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="azureTenantId">Tenant ID</Label>
              <Input
                id="azureTenantId"
                value={azureTenantId}
                onChange={(e) => setAzureTenantId(e.target.value)}
                placeholder="12345678-1234-1234-1234-123456789012"
              />
            </div>
          </>
        );
      
      case 'lxd':
      case 'microcloud':
        return (
          <>
            <div>
              <Label htmlFor="lxdEndpoint">Endpoint URL</Label>
              <Input
                id="lxdEndpoint"
                value={lxdEndpoint}
                onChange={(e) => setLxdEndpoint(e.target.value)}
                placeholder="https://localhost:8443"
              />
            </div>
            <div>
              <Label htmlFor="lxdCertPath">Client Certificate Path</Label>
              <Input
                id="lxdCertPath"
                value={lxdCertPath}
                onChange={(e) => setLxdCertPath(e.target.value)}
                placeholder="/path/to/client.crt"
              />
            </div>
            <div>
              <Label htmlFor="lxdKeyPath">Client Key Path</Label>
              <Input
                id="lxdKeyPath"
                value={lxdKeyPath}
                onChange={(e) => setLxdKeyPath(e.target.value)}
                placeholder="/path/to/client.key"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Cloud className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect to Cloud Provider
          </h1>
          <p className="text-gray-600">
            Step 1: Connect to your cloud infrastructure to begin building
          </p>
        </div>

        {cloudConnections.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Active Connections</span>
            </div>
            <div className="space-y-2">
              {cloudConnections.map((conn) => (
                <div key={conn.id} className="text-sm text-green-700">
                  {conn.name} ({conn.provider.toUpperCase()})
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <Label htmlFor="connectionName">Connection Name</Label>
            <Input
              id="connectionName"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              placeholder="Production Environment"
            />
          </div>

          <div>
            <Label htmlFor="provider">Cloud Provider</Label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as CloudProvider)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cloudProviders.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
          </div>

          {renderCredentialFields()}

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleConnect}
              disabled={connecting || !connectionName.trim()}
              className="flex-1"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
            
            {cloudConnections.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep('infrastructure')}
              >
                Skip to Infrastructure
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your credentials are stored securely and only used to connect to your cloud provider
        </p>
      </div>
    </div>
  );
}
