import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";

interface Props {
  className?: string;
  onOpenChange: (open: boolean) => void;
}

const DropdownServer = ({ className, onOpenChange }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost">
          <EllipsisVertical style={{ width: "20px", height: "20px" }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onOpenChange(true)}
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownServer;
