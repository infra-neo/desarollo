import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

interface Props {
  id: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
}

const SelectWithTooltip = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className = "w-full",
  contentClassName = "max-h-[200px]",
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id={id} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn("overflow-y-auto", contentClassName)}>
          <SelectGroup>
            {options.map((option) => (
              <TooltipProvider key={option.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={option.id}>{option.label}</SelectItem>
                  </TooltipTrigger>
                  {option.description && (
                    <TooltipContent side="bottom">
                      <p>{option.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithTooltip;
