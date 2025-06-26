import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverSchema, type ServerFormData } from "@/schemas/serverFormsSchema";

const useCreateServer = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      nombre: "",
      ip: "",
      tunel: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data: ServerFormData) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Datos del servidor:", data);

      setOpen(false);
      form.reset();

      alert("¡Servidor creado exitosamente!");
    } catch (error) {
      console.error("Error al crear servidor:", error);
      alert("Error al crear el servidor");
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
