import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Server, Loader2 } from "lucide-react";
import useCreateServerGroup from "@/hooks/useCreateServerGroup";

const CreateServerGroupModal = () => {
  const { open, setOpen, isLoading, form, onSubmit, handleCancel } =
    useCreateServerGroup();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Crear Grupo de Servidores
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] p-10">
        <DialogHeader>
          <DialogTitle className="flex gap-4 items-center">
            <Server className="w-6 h-6 text-blue-600" />
            Crear Nuevo Grupo de Servidores
          </DialogTitle>
          <DialogDescription className="mt-2.5">
            Crea un nuevo grupo para organizar tus servidores. Completa los
            campos requeridos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Grupo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Servidores de Producción"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre identificativo para el grupo de servidores
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el propósito y características de este grupo de servidores..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Descripción detallada del grupo ({field.value?.length || 0}
                    /200)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Crear Grupo
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerGroupModal;
