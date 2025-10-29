import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkspaceToolbar from '@/components/workspace/WorkspaceToolbar';
import BlocksSidebar from '@/components/workspace/BlocksSidebar';
import WorkspaceCanvas from '@/components/workspace/WorkspaceCanvas';
import ConfigurationPanel from '@/components/workspace/ConfigurationPanel';
import type { BlockType } from '@/stores/workspaceStore';

export default function WorkspacePage() {
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const onDragStart = (event: React.DragEvent, blockType: BlockType) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = () => {
    setShowConfigPanel(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <WorkspaceToolbar />
        
        <div className="flex flex-1 overflow-hidden">
          <BlocksSidebar onDragStart={onDragStart} />
          
          <WorkspaceCanvas onNodeClick={handleNodeClick} />
          
          {showConfigPanel && <ConfigurationPanel />}
        </div>
      </div>
    </DashboardLayout>
  );
}
