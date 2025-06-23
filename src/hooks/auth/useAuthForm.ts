import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/utils/validations";
import { toast } from "sonner";

const useAuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: LoginFormData | RegisterFormData) => {
    const success = login(
      {
        id: Date.now(),
        name: "name" in data ? data.name : "Usuario",
        email: data.email,
      },
      data.password
    );
    if (success) return navigate("/dashboard");

    toast.error(
      "Credenciales incorrectas. Verifica que el usuario y contraseña sean correctas"
    );
  };

  const toogleLogin = () => {
    setIsLogin((prev) => !prev);
    reset();
    clearErrors();
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLogin,
    toogleLogin,
  };
};

export default useAuthForm;
