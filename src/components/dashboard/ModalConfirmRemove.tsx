import { useState, useEffect } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface ModalConfirmRemoveProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  itemType: "server" | "group";
  dialogTrigger?: boolean;
}

const ModalConfirmRemove = ({
  isOpen,
  setOpen,
  onConfirm,
  itemName,
  itemType,
  dialogTrigger = true,
}: ModalConfirmRemoveProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Create schema for validation
  const formSchema = z.object({
    confirmName: z.string().refine((value) => value === itemName, {
      message: "El nombre no coincide exactamente",
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmName: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const handleSubmit = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      toast.success(
        `${
          itemType === "server" ? "Servidor" : "Grupo"
        } eliminado correctamente`
      );
      form.reset();
      setOpen(false);
    } catch {
      toast.error(
        `Error al eliminar ${itemType === "server" ? "servidor" : "grupo"}`
      );
      console.error(`Error al eliminar ${itemType}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {dialogTrigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" className="hover:text-red-600">
            <Trash2 style={{ width: "20px", height: "20px" }} />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] p-10">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Confirmar eliminación
          </DialogTitle>
          <DialogDescription className="pt-2">
            Estás a punto de eliminar{" "}
            {itemType === "server" ? "el servidor" : "el grupo"}{" "}
            <span className="font-medium text-foreground">"{itemName}"</span>.
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 my-2 rounded-md border bg-destructive/10 border-destructive/20">
          <p className="text-sm font-medium text-destructive">
            Para confirmar, escribe el nombre exacto del{" "}
            {itemType === "server" ? "servidor" : "grupo"}:
            <span className="font-bold"> {itemName}</span>
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="confirmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre del {itemType === "server" ? "servidor" : "grupo"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Escribe ${itemName} para confirmar`}
                      {...field}
                      disabled={isDeleting}
                      className={
                        form.formState.errors.confirmName
                          ? "border-destructive ring-destructive/50"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!form.formState.isValid || isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmRemove;
