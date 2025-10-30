import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkspaceToolbar from '@/components/workspace/WorkspaceToolbar';
import WorkflowStepper from '@/components/workspace/WorkflowStepper';
import CloudConnectionStep from '@/components/workspace/CloudConnectionStep';
import BlocksSidebar from '@/components/workspace/BlocksSidebar';
import WorkspaceCanvas from '@/components/workspace/WorkspaceCanvas';
import ConfigurationPanel from '@/components/workspace/ConfigurationPanel';
import ApplicationCatalogStep from '@/components/workspace/ApplicationCatalogStep';
import { useWorkspaceStore, type BlockType } from '@/stores/workspaceStore';

export default function WorkspacePage() {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const { currentStep } = useWorkspaceStore();

  const onDragStart = (event: React.DragEvent, blockType: BlockType) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = () => {
    setShowConfigPanel(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'connect':
        return <CloudConnectionStep />;
      
      case 'infrastructure':
        return (
          <div className="flex flex-1 overflow-hidden">
            <BlocksSidebar onDragStart={onDragStart} />
            <WorkspaceCanvas onNodeClick={handleNodeClick} />
            {showConfigPanel && <ConfigurationPanel />}
          </div>
        );
      
      case 'applications':
        return <ApplicationCatalogStep />;
      
      case 'users':
      case 'network':
        return (
          <div className="flex flex-1 overflow-hidden">
            <BlocksSidebar onDragStart={onDragStart} />
            <WorkspaceCanvas onNodeClick={handleNodeClick} />
            {showConfigPanel && <ConfigurationPanel />}
          </div>
        );
      
      default:
        return <CloudConnectionStep />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <WorkspaceToolbar />
        <WorkflowStepper />
        
        <div className="flex flex-1 overflow-hidden">
          {renderStepContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
