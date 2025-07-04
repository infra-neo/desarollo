import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverSchema, type ServerFormData } from "@/schemas/serverFormsSchema";
import Servers from "@/services/servers";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const useCreateServer = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      nombre: "",
      ip: "",
      tunel: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data: ServerFormData, groupGuid: string) => {
    setIsLoading(true);

    try {
      await Servers.createServer({
        ...data,
        grupo_guid: groupGuid,
      });

      queryClient.invalidateQueries({
        queryKey: ["servers", groupGuid],
      });

      setOpen(false);
      form.reset();

      toast.success("Servidor creado exitosamente!");
    } catch (error) {
      console.error("Error al crear servidor:", error);
      toast.error("Error al crear el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return {
    open,
    setOpen,
    isLoading,
    form,
    onSubmit,
    handleCancel,
  };
};

export default useCreateServer;
