import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";
import AVAILABLE_COMMANDS from "@/utils/tsplusCommands";
import type { CommandMethod } from "@/types/command.types";

interface Props {
  server: any;
  onClose: () => void;
}

const ActionPanel = ({ server, onClose }: Props) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("");
  const [paramsValues, setParamsValues] = useState<Record<string, string>>({});
  const [error, setError] = useState(null);

  const commandDefinition = AVAILABLE_COMMANDS.find(
    (command) => command.id === selectedCommand
  );

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommand(e.target.value);
    setParamsValues({});
    setError(null);
  };

  const handleParamChange = (paramId: string, value: string) => {
    setParamsValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  const executedCommand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!commandDefinition) return;

    setError(null);
    setIsExecuting(true);

    try {
      const paramArgs = commandDefinition.params.map(
        (param) => paramsValues[param.id]
      );

      const response = await (commandDefinition.method as CommandMethod)(
        ...paramArgs
      );
      // console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsExecuting(false);
    }
  };

  const isDisabled =
    isExecuting ||
    !commandDefinition ||
    !selectedCommand ||
    Object.values(paramsValues).some((value) => !value);

  return (
    <Card className="mt-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">
              Panel de Control - {server.name}
            </CardTitle>
            <CardDescription>Ejecuta acciones en este servidor</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            {/* // * Available commands */}

            <Label htmlFor="command-select">Selecciona un comando</Label>
            <select
              id="command-select"
              value={selectedCommand}
              onChange={handleCommandChange}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar comando...</option>
              {AVAILABLE_COMMANDS.map((command) => (
                <option key={command.id} value={command.id}>
                  {command.name}
                </option>
              ))}
            </select>
          </div>

          {commandDefinition && commandDefinition.params.length > 0 && (
            <>
              {/* // * We could use this later */}
              {/* <h3>{commandDefinition.name}</h3> */}
              {commandDefinition.params.map((param) => (
                <div className="space-y-2" key={param.id}>
                  <Label htmlFor={`param-${param.id}`}>{param.name}</Label>
                  <Input
                    id={`param-${param.id}`}
                    type={param.type}
                    value={paramsValues[param.id] || ""}
                    onChange={(e) =>
                      handleParamChange(param.id, e.target.value)
                    }
                    required
                    placeholder="Ingresa parámetros..."
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <form onSubmit={executedCommand} className="flex pt-4 space-x-3">
          <Button
            disabled={isDisabled}
            className="disabled:opacity-50"
            variant="gradient"
          >
            <Play className="mr-2 w-4 h-4" />
            {isExecuting ? "Ejecutando..." : "Ejecutar Acción"}
          </Button>

          {/* // * I leave here because later we can implement logs */}
          {/* <Button variant="outline">
            <Eye className="mr-2 w-4 h-4" />
            Ver Logs
          </Button> */}
        </form>
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
