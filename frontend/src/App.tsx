import Sidebar from '@/components/Sidebar';
import Workspace from '@/components/Workspace';
import InspectorPanel from '@/components/InspectorPanel';

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-white">
      <Sidebar />
      <Workspace />
      <InspectorPanel />
    </div>
  );
}
