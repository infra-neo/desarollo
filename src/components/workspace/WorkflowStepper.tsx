import { useWorkspaceStore, type WorkflowStep } from '@/stores/workspaceStore';
import { Cloud, Network, Users, Package, Shield, Check } from 'lucide-react';

const steps: { id: WorkflowStep; label: string; icon: any }[] = [
  { id: 'connect', label: 'Connect Cloud', icon: Cloud },
  { id: 'infrastructure', label: 'Infrastructure', icon: Network },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'applications', label: 'Applications', icon: Package },
  { id: 'network', label: 'Network & Security', icon: Shield },
];

export default function WorkflowStepper() {
  const { currentStep, setCurrentStep, cloudConnections } = useWorkspaceStore();

  const getStepStatus = (stepId: WorkflowStep) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const canNavigateToStep = (stepId: WorkflowStep) => {
    // Can't navigate to infrastructure if not connected
    if (stepId !== 'connect' && cloudConnections.length === 0) {
      return false;
    }
    return true;
  };

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          const canNavigate = canNavigateToStep(step.id);

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => canNavigate && setCurrentStep(step.id)}
                disabled={!canNavigate}
                className={`
                  flex items-center gap-2 group
                  ${!canNavigate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : status === 'current'
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-left">
                  <div
                    className={`
                      text-sm font-medium
                      ${status === 'current' ? 'text-blue-600' : 'text-gray-700'}
                    `}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    Step {index + 1}
                  </div>
                </div>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors
                    ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
