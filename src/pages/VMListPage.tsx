import DashboardLayout from "@/components/layout/DashboardLayout";
import { servers } from "@/data/servers";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Html5ConnectionModal from "@/components/Html5ConnectionModal";

export default function VMListPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleConnect = (s: string) => {
    setSelected(s);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Virtual Machines</h2>
        <p className="text-sm text-gray-600 mb-6">Lista de VMs detectadas (mock)</p>

        <div className="grid grid-cols-1 gap-4 max-w-4xl">
          {servers.map((s) => (
            <div key={s.guid} className="flex items-center justify-between bg-white/5 p-4 rounded">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-400">{s.url}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-300 mr-4">{s.status}</div>
                <Button size="sm" onClick={() => handleConnect(s.guid)}>Connect (HTML5)</Button>
              </div>
            </div>
          ))}
        </div>

        <Html5ConnectionModal open={open} setOpen={setOpen} targetGuid={selected} />
      </div>
    </DashboardLayout>
  );
}
