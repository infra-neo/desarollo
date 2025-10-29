import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Search, Check } from 'lucide-react';
import { 
  getApplicationsByCategory, 
  searchApplications,
  type AppCategory,
  type Application 
} from '@/services/applicationCatalog';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { toast } from 'sonner';

const categories: { id: AppCategory; label: string; icon: string }[] = [
  { id: 'development', label: 'Development', icon: '💻' },
  { id: 'productivity', label: 'Productivity', icon: '📊' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'media', label: 'Media', icon: '🎬' },
  { id: 'utilities', label: 'Utilities', icon: '🔧' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'database', label: 'Database', icon: '🗄️' },
];

interface ApplicationCatalogStepProps {
  onComplete?: () => void;
}

export default function ApplicationCatalogStep({ onComplete }: ApplicationCatalogStepProps) {
  const { selectedNode, updateNode } = useWorkspaceStore();
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('development');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApps, setSelectedApps] = useState<Application[]>([]);

  const displayedApps = searchQuery 
    ? searchApplications(searchQuery)
    : getApplicationsByCategory(selectedCategory);

  const toggleApp = (app: Application) => {
    setSelectedApps(prev => {
      const exists = prev.find(a => a.id === app.id);
      if (exists) {
        return prev.filter(a => a.id !== app.id);
      } else {
        return [...prev, app];
      }
    });
  };

  const isAppSelected = (appId: string) => {
    return selectedApps.some(a => a.id === appId);
  };

  const handleInstallApps = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, {
        ...selectedNode.data.config,
        applications: selectedApps,
      });
      
      toast.success(`${selectedApps.length} applications queued for installation`, {
        description: 'Applications will be installed when the VM is deployed',
      });
      
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Catalog</h2>
            <p className="text-sm text-gray-600">
              Select applications to install on your infrastructure
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-64 bg-gray-50 border-r overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${selectedCategory === cat.id 
                    ? 'bg-blue-100 text-blue-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {selectedApps.length > 0 && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-semibold text-blue-900 mb-2">
                Selected Apps
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {selectedApps.length}
              </div>
            </div>
          )}
        </div>

        {/* Application Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedApps.map((app) => (
              <button
                key={app.id}
                onClick={() => toggleApp(app)}
                className={`
                  relative flex flex-col items-center p-4 rounded-lg border-2 transition-all
                  ${isAppSelected(app.id)
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                  }
                `}
              >
                {isAppSelected(app.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="text-4xl mb-2">{app.icon || '📦'}</div>
                <div className="text-sm font-semibold text-center text-gray-900 mb-1">
                  {app.name}
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {app.description}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {app.packageManager}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {displayedApps.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No applications found</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 bg-white border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedApps.length} application{selectedApps.length !== 1 ? 's' : ''} selected
        </div>
        <Button
          onClick={handleInstallApps}
          disabled={selectedApps.length === 0}
        >
          <Package className="w-4 h-4 mr-2" />
          Add to Configuration
        </Button>
      </div>
    </div>
  );
}
