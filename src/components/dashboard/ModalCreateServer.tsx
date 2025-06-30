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
import { Plus, Server, Loader2, Globe, Link } from "lucide-react";
import useCreateServer from "@/hooks/useCreateServer";

const ModalCreateServer = () => {
  const { open, setOpen, isLoading, form, onSubmit, handleCancel } =
    useCreateServer();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Crear Servidor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] p-10">
        <DialogHeader>
          <DialogTitle className="flex gap-4 items-center">
            <Server className="w-6 h-6 text-blue-600" />
            Crear Nuevo Servidor
          </DialogTitle>
          <DialogDescription className="mt-2.5">
            Agrega un nuevo servidor al sistema. Completa todos los campos
            requeridos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Servidor *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Servidor-Web-01"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre identificativo del servidor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      <Globe className="w-3 h-3" />
                      Dirección IP *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="192.168.1.100"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      IP del servidor (formato IPv4)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tunel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    <Link className="w-3 h-3" />
                    Túnel de Conexión *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ssh://usuario@servidor.com:22 o tunnel-name-01"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Configuración del túnel o método de conexión
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
                      placeholder="Describe el propósito del servidor, su función, características técnicas, etc..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Información detallada del servidor (
                    {field.value?.length || 0}/300)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
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
                    Creando Servidor...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4" />
                    Crear Servidor
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

export default ModalCreateServer;
