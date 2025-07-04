import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  cardVariants,
  formItemVariants,
  buttonVariants,
} from "@/utils/animations";
import useAuthForm from "@/hooks/auth/useAuthForm";
import Logo from "@/assets/logo/Logo_cuadrado.png";

const AuthPage = () => {
  const { register, handleSubmit, errors, onSubmit, isLogin, toogleLogin } =
    useAuthForm();

  return (
    <motion.div
      className="flex justify-center items-center p-4 min-h-screen bg-app-gradient-light"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        <Card className="w-full border-0 shadow-2xl backdrop-blur-sm bg-white/80">
          <CardHeader className="pb-2 text-center">
            <motion.div
              className="flex relative top-2 justify-center items-center px-2 mx-auto mb-4 w-72 h-auto rounded-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
            >
              <img src={Logo} alt="Logo" className="w-fit h-fit" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text card-gradient">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <CardDescription className="text-gray-600">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isLogin ? "login-desc" : "register-desc"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isLogin
                      ? "Accede a tu panel de servidores"
                      : "Únete a nuestra plataforma"}
                  </motion.span>
                </AnimatePresence>
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    className="space-y-2"
                    key="name-field"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    variants={formItemVariants}
                    custom={0}
                  >
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      {...register("name")}
                    />
                    {!isLogin && "name" in errors && errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="space-y-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 0 : 1}
              >
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 1 : 2}
              >
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    className="space-y-2"
                    key="confirm-password-field"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    variants={formItemVariants}
                    custom={3}
                  >
                    <Label htmlFor="confirmPassword">
                      Confirmar contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      {...register("confirmPassword")}
                    />
                    {!isLogin &&
                      "confirmPassword" in errors &&
                      errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <Button className="w-full" variant="gradient">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isLogin ? "login-btn" : "register-btn"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>

            {/* // * We'll use this later */}
            {/* <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      toogleLogin();
                    }}
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isLogin ? "register-link" : "login-link"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isLogin
                          ? "¿No tienes cuenta? Regístrate"
                          : "¿Ya tienes cuenta? Inicia sesión"}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.div> */}
          </CardContent>
        </Card>
      </motion.form>
    </motion.div>
  );
};

export default AuthPage;
