import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { CommandDefinition } from "@/types/command.types";

type Props = {
  commandDefinition: CommandDefinition;
  paramsValues: Record<string, string>;
  handleParamChange: (paramId: string, value: string) => void;
};

//

const CommandParamsForm = ({
  commandDefinition,
  paramsValues,
  handleParamChange,
}: Props) => {
  return (
    <>
      {commandDefinition && commandDefinition.params.length > 0 && (
        <>
          {/* // * We could use this later */}
          {/* <h3>{commandDefinition.name}</h3> */}
          {commandDefinition.params.map((param) => (
            <div className="space-y-2" key={param.id}>
              <Label htmlFor={`param-${param.id}`}>{param.name}</Label>
              {param.selectOptions ? (
                <Select
                  value={paramsValues[param.id] || ""}
                  onValueChange={(value) => handleParamChange(param.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {param.selectOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`param-${param.id}`}
                  type={param.type}
                  value={paramsValues[param.id] || ""}
                  onChange={(e) => handleParamChange(param.id, e.target.value)}
                  required
                  placeholder="Ingresa parámetros..."
                  className="focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CommandParamsForm;
