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
import type { CommandDefinition, CommandMethod } from "@/types/command.types";
import SelectWithTooltip from "../common/SelectWithTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommandParamsForm from "./CommandParamsForm";
import ModalConfirmCommand from "../common/ModalConfirmCommand";

interface Props {
  server: any;
  onClose: () => void;
}

const ActionPanel = ({ server, onClose }: Props) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("");
  const [paramsValues, setParamsValues] = useState<Record<string, string>>({});
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const commandDefinition = AVAILABLE_COMMANDS.find(
    (command) => command.id === selectedCommand
  );

  const handleCommandChange = (value: string) => {
    setSelectedCommand(value);
    setParamsValues({});
    setError(null);
  };

  const handleParamChange = (paramId: string, value: string) => {
    setParamsValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  const executedCommand = async () => {
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
    <>
      <ModalConfirmCommand
        open={openModal}
        onConfirm={() => {
          setOpenModal(false);
          executedCommand();
        }}
        onCancel={() => setOpenModal(false)}
      />
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">
                Panel de Control - {server.name}
              </CardTitle>
              <CardDescription>
                Ejecuta acciones en este servidor
              </CardDescription>
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

              <SelectWithTooltip
                id="command-select"
                label="Selecciona un comando"
                options={AVAILABLE_COMMANDS.map((command) => ({
                  id: command.id,
                  label: command.name,
                  description: command.description,
                }))}
                value={selectedCommand}
                onChange={handleCommandChange}
                contentClassName="max-h-[450px]"
              />
            </div>

            <CommandParamsForm
              commandDefinition={commandDefinition as CommandDefinition}
              paramsValues={paramsValues}
              handleParamChange={handleParamChange}
            />
          </div>

          <form
            onSubmit={() => setOpenModal(true)}
            className="flex pt-4 space-x-3"
          >
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
    </>
  );
};

export default ActionPanel;
