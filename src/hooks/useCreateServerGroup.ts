import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serverGroupSchema,
  type ServerGroupFormData,
} from "@/schemas/serverFormsSchema";

const useCreateServerGroup = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ServerGroupFormData>({
    resolver: zodResolver(serverGroupSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data: ServerGroupFormData) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Datos del grupo de servidores:", data);

      setOpen(false);
      form.reset();

      alert("¡Grupo de servidores creado exitosamente!");
    } catch (error) {
      console.error("Error al crear grupo de servidores:", error);
      alert("Error al crear el grupo de servidores");
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
