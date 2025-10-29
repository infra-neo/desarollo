import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

const steps = [
  "Provisioning resources",
  "Configuring network",
  "Deploying services",
  "Running post-deploy checks",
  "Finishing"
];

export default function InstallationProgress() {
  const [current, setCurrent] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t: any;
    if (running && current < steps.length) {
      t = setTimeout(() => setCurrent((c) => c + 1), 1400);
    }
    return () => clearTimeout(t);
  }, [running, current]);

  const start = () => {
    setCurrent(0);
    setRunning(true);
  };

  const progress = Math.min(100, Math.round((current / steps.length) * 100));

  return (
    <DashboardLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Installation Progress</h2>
        <p className="text-sm text-gray-600 mb-4">
          Visualiza el progreso del despliegue de tu infraestructura.
        </p>

        <div className="space-y-4 max-w-2xl">
          <div className="w-full bg-gray-800 rounded h-3 overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>Step {Math.min(current + 1, steps.length)} / {steps.length}</div>
            <div className="text-gray-500">{progress}%</div>
          </div>

          <div className="bg-white/5 p-4 rounded">
            <h3 className="font-medium">{steps[Math.min(current, steps.length - 1)]}</h3>
            <p className="text-sm text-gray-400 mt-2">Detalles de la acción actual se mostrarán aquí.</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={start} className="bg-blue-600">Start</Button>
            <Button variant="outline" onClick={() => { setRunning(false); setCurrent(0); }}>Reset</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
