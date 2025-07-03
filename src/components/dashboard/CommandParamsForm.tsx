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
import {
  Controller,
  type UseFormRegister,
  type Control,
} from "react-hook-form";

type Props = {
  commandDefinition: CommandDefinition;
  paramsValues: Record<string, string | number>;
  handleParamChange: (paramId: string, value: string | number) => void;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: any;
};

const CommandParamsForm = ({
  commandDefinition,
  paramsValues,
  handleParamChange,
  control,
  errors,
}: Props) => {
  return (
    <>
      {commandDefinition && commandDefinition.params.length > 0 && (
        <>
          {/* // * We could use this later */}
          {/* <h3>{commandDefinition.name}</h3> */}
          {commandDefinition.params.map((param) => (
            <div key={param.id} className="space-y-2">
              <Label htmlFor={`param-${param.id}`}>{param.name}</Label>
              {param.selectOptions ? (
                <Controller
                  name={param.id}
                  control={control}
                  defaultValue={paramsValues[param.id] || ""}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleParamChange(param.id, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={param.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {param.selectOptions?.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Controller
                  name={param.id}
                  control={control}
                  defaultValue={paramsValues[param.id] || ""}
                  render={({ field }) => (
                    <Input
                      id={`param-${param.id}`}
                      type={param.type}
                      value={field.value}
                      required
                      min={param.type === "number" ? 0 : undefined}
                      placeholder={param.placeholder}
                      className="focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const value =
                          param.type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                        field.onChange(value);
                        handleParamChange(param.id, value);
                      }}
                    />
                  )}
                />
              )}
              <span className="relative left-1.5 text-xs text-red-500">
                {errors[param.id]?.message}
              </span>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CommandParamsForm;
