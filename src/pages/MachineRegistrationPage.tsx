import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Key, 
  Server, 
  CheckCircle2, 
  Copy,
  Terminal,
  Monitor,
  Apple,
  MonitorSmartphone,
  Shield,
  Network,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface RegistrationToken {
  token: string;
  expiresAt: Date;
  machineKey?: string;
}

export default function MachineRegistrationPage() {
  const [step, setStep] = useState<'intro' | 'generate' | 'download' | 'register'>('intro');
  const [machineName, setMachineName] = useState('');
  const [registrationToken, setRegistrationToken] = useState<RegistrationToken | null>(null);
  const [selectedOS, setSelectedOS] = useState<'windows' | 'linux' | 'macos'>('windows');
  const [generating, setGenerating] = useState(false);

  const generateToken = async () => {
    if (!machineName.trim()) {
      toast.error('Please enter a machine name');
      return;
    }

    setGenerating(true);
    
    // Simulate API call to generate registration token
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const token: RegistrationToken = {
      token: `nsk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      machineKey: `mkey_${Math.random().toString(36).substring(2, 15)}`,
    };
    
    setRegistrationToken(token);
    setGenerating(false);
    setStep('download');
    
    toast.success('Registration token generated successfully');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getInstallCommand = () => {
    if (!registrationToken) return '';
    
    switch (selectedOS) {
      case 'windows':
        return `# PowerShell (Run as Administrator)
Invoke-WebRequest -Uri "https://your-console.example.com/api/download/client/windows" -OutFile "neogenesys-client.exe"
.\\neogenesys-client.exe install --token="${registrationToken.token}" --name="${machineName}"`;
      
      case 'linux':
        return `# Linux Installation
curl -fsSL https://your-console.example.com/api/download/client/linux | sh
sudo neogenesys-client register --token="${registrationToken.token}" --name="${machineName}"`;
      
      case 'macos':
        return `# macOS Installation
brew tap neogenesys/tap
brew install neogenesys-client
neogenesys-client register --token="${registrationToken.token}" --name="${machineName}"`;
      
      default:
        return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl">
                <Server className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register On-Premise Machine
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect your on-premise machines securely to the console using our Headscale-powered VPN network
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {['intro', 'generate', 'download', 'register'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step === s ? 'bg-blue-600 text-white' : 
                  ['intro', 'generate', 'download', 'register'].indexOf(step) > index ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  {['intro', 'generate', 'download', 'register'].indexOf(step) > index ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-24 h-1 ${
                    ['intro', 'generate', 'download', 'register'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'intro' && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How It Works
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Key className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">1. Generate Registration Token</h3>
                      <p className="text-gray-600">Create a secure, time-limited token for your machine registration</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">2. Download Client Agent</h3>
                      <p className="text-gray-600">Get the lightweight client for your operating system (Windows, Linux, macOS)</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Network className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">3. Install and Register</h3>
                      <p className="text-gray-600">Run the client on your machine to establish secure VPN connection via Headscale</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">4. Secure Management</h3>
                      <p className="text-gray-600">Your machine appears in the console and can be managed securely</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Security Note</h4>
                      <p className="text-sm text-blue-800">
                        All connections are encrypted using WireGuard protocol through Headscale. 
                        Your machine will be part of a secure mesh network accessible only through your console.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep('generate')} 
                  className="w-full gap-2"
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            )}

            {step === 'generate' && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Generate Registration Token
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <Label htmlFor="machineName">Machine Name</Label>
                    <Input
                      id="machineName"
                      placeholder="e.g., office-workstation-01"
                      value={machineName}
                      onChange={(e) => setMachineName(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Choose a descriptive name to identify this machine in your console
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Token Settings</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Expiration:</span>
                        <span className="font-medium text-gray-900">24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reusable:</span>
                        <span className="font-medium text-gray-900">No (Single use)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span className="font-medium text-gray-900">Headscale VPN</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('intro')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={generateToken}
                    disabled={generating || !machineName.trim()}
                    className="flex-1"
                  >
                    {generating ? 'Generating...' : 'Generate Token'}
                  </Button>
                </div>
              </Card>
            )}

            {step === 'download' && registrationToken && (
              <Card className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Token Generated Successfully
                  </h2>
                  <p className="text-gray-600">
                    Machine: <span className="font-semibold">{machineName}</span>
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <Label>Registration Token</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={registrationToken.token}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(registrationToken.token, 'Token')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Expires: {registrationToken.expiresAt.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Key className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Important</h4>
                        <p className="text-sm text-yellow-800">
                          Save this token securely. It will be needed to register your machine and cannot be retrieved later.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Select Operating System</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setSelectedOS('windows')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedOS === 'windows'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium">Windows</p>
                      </button>
                      
                      <button
                        onClick={() => setSelectedOS('linux')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedOS === 'linux'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Terminal className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium">Linux</p>
                      </button>
                      
                      <button
                        onClick={() => setSelectedOS('macos')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedOS === 'macos'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Apple className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium">macOS</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('generate')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep('register')}
                    className="flex-1 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download & Install
                  </Button>
                </div>
              </Card>
            )}

            {step === 'register' && registrationToken && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Install Client Agent
                </h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Installation Command</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(getInstallCommand(), 'Command')}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                        {getInstallCommand()}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                      <li>Copy the installation command above</li>
                      <li>Open a terminal/PowerShell with administrator privileges on your target machine</li>
                      <li>Paste and run the command</li>
                      <li>The client will download, install, and automatically register with your console</li>
                      <li>Once registered, the machine will appear in your infrastructure dashboard</li>
                    </ol>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Alternative: Manual Download</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="gap-2">
                        <Monitor className="w-4 h-4" />
                        Windows (x64)
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Terminal className="w-4 h-4" />
                        Linux (x64)
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Apple className="w-4 h-4" />
                        macOS (Universal)
                      </Button>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <MonitorSmartphone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Background Service</h4>
                        <p className="text-sm text-green-800">
                          The client runs as a system service in the background, maintaining the secure VPN connection 
                          and allowing your console to manage the machine even after you close your terminal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('download')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success('Registration process completed!');
                      // Reset for new registration
                      setStep('intro');
                      setMachineName('');
                      setRegistrationToken(null);
                    }}
                    className="flex-1"
                  >
                    Done
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
