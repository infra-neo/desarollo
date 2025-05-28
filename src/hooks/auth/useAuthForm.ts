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
    login({
      id: Date.now(),
      name: "name" in data ? data.name : "Usuario",
      email: data.email,
    });
    navigate("/dashboard");
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
