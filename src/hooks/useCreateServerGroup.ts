import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serverGroupSchema,
  type ServerGroupFormData,
} from "@/schemas/serverFormsSchema";
import Servers from "@/services/servers";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const useCreateServerGroup = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<ServerGroupFormData>({
    resolver: zodResolver(serverGroupSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data: ServerGroupFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await Servers.createGroupServer({
        ...data,
        empresa_guid: user.enterpriseGuid,
      });

      queryClient.invalidateQueries({
        queryKey: ["server-group"],
      });

      setOpen(false);
      form.reset();

      toast.success("Grupo de servidores creado exitosamente!");
    } catch (error) {
        // Try to extract a useful message from the error (axios response or generic)
        console.error("Error al crear grupo de servidores:", error);
        let message = "Error al crear el grupo de servidores";

        try {
          const err: any = error;
          if (err?.response?.data) {
            // Prefer backend message if provided
            message =
              err.response.data.message || JSON.stringify(err.response.data);
          } else if (err?.message) {
            message = err.message;
          }
        } catch (e) {
          // ignore extraction errors
        }

        toast.error(message);
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

export default useCreateServerGroup;
