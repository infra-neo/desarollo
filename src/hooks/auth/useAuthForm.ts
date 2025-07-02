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
    login(data);
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
