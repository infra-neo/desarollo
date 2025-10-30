import { Button } from '@/components/ui/button';
import Html5ConnectionModal from '@/components/Html5ConnectionModal';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { 
  Download, 
  Upload, 
  CheckCircle, 
  Play, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkspaceToolbar() {
  const { nodes, edges, exportBlueprint, validateWorkspace, setNodes, setEdges } = useWorkspaceStore();
  const navigate = useNavigate();
  const [htmlOpen, setHtmlOpen] = useState(false);

  const handleValidate = () => {
    const { isValid, errors } = validateWorkspace();
    
    if (isValid) {
      toast.success('Workspace configuration is valid!', {
        description: 'All blocks are properly configured and connected.',
      });
    } else {
      toast.error('Validation failed', {
        description: (
          <div className="mt-2">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        ),
      });
    }
  };

  const handleExport = () => {
    const blueprint = exportBlueprint();
    const blob = new Blob([blueprint], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infrastructure-blueprint-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Blueprint exported successfully!', {
      description: 'Configuration saved to JSON file.',
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const blueprint = JSON.parse(content);
          
          if (blueprint.nodes && blueprint.edges) {
            setNodes(blueprint.nodes.map((node: any) => ({
              ...node,
              type: 'custom',
            })));
            setEdges(blueprint.edges);
            toast.success('Blueprint imported successfully!');
          } else {
            toast.error('Invalid blueprint format');
          }
        } catch {
          toast.error('Failed to import blueprint', {
            description: 'Invalid JSON file format.',
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDeploy = () => {
    const { isValid } = validateWorkspace();
    
    if (!isValid) {
      toast.error('Cannot deploy', {
        description: 'Please fix validation errors first.',
      });
      return;
    }

    // Placeholder for actual deployment logic
    toast.info('Deploy functionality', {
      description: 'This would trigger the deployment process via API.',
      duration: 5000,
    });
  };

  const handleClear = () => {
    if (nodes.length === 0) return;
    
    if (confirm('Are you sure you want to clear the entire workspace?')) {
      setNodes([]);
      setEdges([]);
      toast.success('Workspace cleared');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Spark UI Builder</h1>
          <p className="text-sm text-gray-600">
            Hybrid Cloud & Infrastructure Orchestrator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={nodes.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleValidate}
            disabled={nodes.length === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Validate
          </Button>

          <Button
            size="sm"
            onClick={handleDeploy}
            disabled={nodes.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/installation')}
          >
            Installation
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/vms')}
          >
            VMs
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setHtmlOpen(true)}
          >
            HTML5
          </Button>
          <Html5ConnectionModal open={htmlOpen} setOpen={setHtmlOpen} targetGuid={null} />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <Button
            variant="destructive"
            size="sm"
            onClick={handleClear}
            disabled={nodes.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {nodes.length > 0 && (
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {nodes.length} block{nodes.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            {edges.length} connection{edges.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
