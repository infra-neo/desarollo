import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Server,
  Terminal,
  Monitor,
  Download,
  Copy,
  CheckCircle2,
  ArrowRight,
  Link as LinkIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { remoteManagementService } from '@/services/remoteManagementService';

export default function ConnectExistingMachinePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'method' | 'details' | 'agent' | 'connecting'>('method');
  const [connectionMethod, setConnectionMethod] = useState<'ssh' | 'rdp' | 'agent'>('agent');
  const [machineName, setMachineName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [selectedOS, setSelectedOS] = useState<'linux' | 'windows' | 'macos'>('linux');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (!machineName || !ipAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    setConnecting(true);

    try {
      await remoteManagementService.connectExistingMachine({
        name: machineName,
        ipAddress,
        os: selectedOS,
        connectionType: connectionMethod,
        credentials: {
          username,
          password,
        },
      });

      toast.success('Machine connected successfully!');
      navigate('/remote');
    } catch (error) {
      toast.error('Failed to connect machine');
    } finally {
      setConnecting(false);
    }
  };

  const getAgentInstallCommand = () => {
    if (selectedOS === 'linux') {
      return `curl -s https://remote.neogenesys.com/install.sh | sudo bash -s ${machineName}`;
    } else if (selectedOS === 'windows') {
      return `Invoke-WebRequest -Uri "https://remote.neogenesys.com/install.ps1" -OutFile "install.ps1"; .\\install.ps1 -MachineId "${machineName}"`;
    }
    return '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text card-gradient">
              Connect Existing Machine
            </h1>
            <p className="text-gray-600">
              Connect an existing server or workstation to manage it remotely
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {['method', 'details', connectionMethod === 'agent' ? 'agent' : 'connecting', 'connecting'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : ['method', 'details'].indexOf(s) < ['method', 'details', connectionMethod === 'agent' ? 'agent' : 'connecting'].indexOf(step)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {['method', 'details'].indexOf(s) < ['method', 'details', connectionMethod === 'agent' ? 'agent' : 'connecting'].indexOf(step) ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div className={`w-16 h-1 ${
                    ['method', 'details'].indexOf(s) < ['method', 'details', connectionMethod === 'agent' ? 'agent' : 'connecting'].indexOf(step)
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Connection Method */}
          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select Connection Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setConnectionMethod('agent')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      connectionMethod === 'agent'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <LinkIcon className="w-12 h-12 mb-3 mx-auto text-blue-600" />
                    <h3 className="font-semibold mb-2">Remote Agent</h3>
                    <p className="text-sm text-gray-600">
                      Install agent for unattended access (Recommended)
                    </p>
                  </button>

                  <button
                    onClick={() => setConnectionMethod('ssh')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      connectionMethod === 'ssh'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Terminal className="w-12 h-12 mb-3 mx-auto text-green-600" />
                    <h3 className="font-semibold mb-2">SSH</h3>
                    <p className="text-sm text-gray-600">
                      Connect via SSH (Linux/macOS)
                    </p>
                  </button>

                  <button
                    onClick={() => setConnectionMethod('rdp')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      connectionMethod === 'rdp'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Monitor className="w-12 h-12 mb-3 mx-auto text-purple-600" />
                    <h3 className="font-semibold mb-2">RDP</h3>
                    <p className="text-sm text-gray-600">
                      Connect via Remote Desktop (Windows)
                    </p>
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep('details')}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Machine Details */}
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Machine Details</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="machineName">Machine Name</Label>
                    <Input
                      id="machineName"
                      value={machineName}
                      onChange={(e) => setMachineName(e.target.value)}
                      placeholder="my-server-01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ipAddress">IP Address or Hostname</Label>
                    <Input
                      id="ipAddress"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="192.168.1.100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="os">Operating System</Label>
                    <select
                      id="os"
                      value={selectedOS}
                      onChange={(e) => setSelectedOS(e.target.value as any)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="linux">🐧 Linux</option>
                      <option value="windows">🪟 Windows</option>
                      <option value="macos">🍎 macOS</option>
                    </select>
                  </div>

                  {connectionMethod !== 'agent' && (
                    <>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin"
                        />
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('method')}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (connectionMethod === 'agent') {
                        setStep('agent');
                      } else {
                        handleConnect();
                        setStep('connecting');
                      }
                    }}
                  >
                    {connectionMethod === 'agent' ? 'Next' : 'Connect'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Agent Installation */}
          {step === 'agent' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Install Remote Agent</h2>
                <p className="text-gray-600 mb-6">
                  Run the following command on your {selectedOS} machine to install the remote management agent:
                </p>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex items-start justify-between">
                    <code className="text-sm flex-1 break-all">{getAgentInstallCommand()}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(getAgentInstallCommand())}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2 text-blue-900">What this does:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Installs the remote management agent</li>
                    <li>• Enables unattended access for HTML5 remote desktop</li>
                    <li>• Allows file transfer and script execution</li>
                    <li>• Installs Websoft9 features (app store, file manager, terminal)</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('details')}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      handleConnect();
                      setStep('connecting');
                    }}
                  >
                    I've Installed the Agent
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Connecting State */}
          {step === 'connecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="p-12 text-center">
                <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
                <h2 className="text-2xl font-semibold mb-2">Connecting to Machine...</h2>
                <p className="text-gray-600">
                  This may take a few moments while we establish the connection
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
