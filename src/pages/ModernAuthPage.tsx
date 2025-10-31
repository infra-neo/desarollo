import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  User, 
  Building2, 
  Mail, 
  Lock,
  UserPlus
} from "lucide-react";
import Logo from "@/assets/logo/Logo_horizontal.png";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type AuthMode = 'selection' | 'local' | 'corporate' | 'admin' | 'register' | 'register-sso';

const ModernAuthPage = () => {
  const { login, register: registerUser } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login({ email, password });
      toast.success('Acceso concedido');
    } catch (error) {
      toast.error('Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    
    try {
      await registerUser({ name, email, password, confirmPassword });
      toast.success('Cuenta creada exitosamente');
      setAuthMode('local');
    } catch (error) {
      toast.error('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleCorporateLogin = () => {
    toast.info('Redirigiendo a autenticación corporativa...');
    // Redirect to SSO/OIDC provider
    window.location.href = '/api/auth/sso/login';
  };

  const handleSSORegister = () => {
    toast.info('Redirigiendo a registro corporativo...');
    // Redirect to SSO registration
    window.location.href = '/api/auth/sso/register';
  };

  // Enhanced animated background with image overlay
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.5)), url('/bg-login.jpg')`,
        }}
      />
      
      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,${0.1 + Math.random() * 0.2}) 0%, transparent 70%)`,
            width: Math.random() * 400 + 100,
            height: Math.random() * 400 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  // Selection Screen
  const SelectionMode = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img src={Logo} alt="Logo" className="h-20 w-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenido
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Selecciona tu método de autenticación
        </p>
      </motion.div>

      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setAuthMode('local')}
            className="w-full h-14 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <User className="mr-3 h-5 w-5" />
            Usuario y Contraseña
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setAuthMode('corporate')}
            className="w-full h-14 text-base bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
          >
            <Building2 className="mr-3 h-5 w-5" />
            Cuenta Corporativa
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setAuthMode('admin')}
            className="w-full h-14 text-base bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
          >
            <Shield className="mr-3 h-5 w-5" />
            Administrador
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4 border-t border-gray-200"
        >
          <p className="text-sm text-center text-gray-500 mb-3">
            ¿No tienes cuenta?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setAuthMode('register')}
              variant="outline"
              className="h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Registrarse
            </Button>
            <Button
              onClick={() => setAuthMode('register-sso')}
              variant="outline"
              className="h-12 border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Registro SSO
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-xs text-gray-400 mt-6"
      >
        <p>Todos los métodos incluyen autenticación multifactor (MFA)</p>
      </motion.div>
    </motion.div>
  );

  // Local User Login Form
  const LocalLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setAuthMode('selection')}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Volver
      </button>

      <div className="flex justify-center mb-6">
        <img src={Logo} alt="Logo" className="h-14 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
        Acceso Local
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {loading ? 'Autenticando...' : 'Acceder'}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Se requerirá autenticación multifactor (MFA)
        </p>
      </form>
    </motion.div>
  );

  // Corporate Login Screen
  const CorporateLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setAuthMode('selection')}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Volver
      </button>

      <div className="flex justify-center mb-6">
        <img src={Logo} alt="Logo" className="h-14 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
        Cuenta Corporativa
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="corporate-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo electrónico corporativo
          </Label>
          <Input
            id="corporate-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.com"
            required
            className="h-12"
          />
        </div>

        <Button
          onClick={handleCorporateLogin}
          className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          Continuar con SSO
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Incluye autenticación multifactor (MFA)
        </p>
      </div>
    </motion.div>
  );

  // Admin Login Form
  const AdminLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setAuthMode('selection')}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Volver
      </button>

      <div className="flex justify-center mb-6">
        <img src={Logo} alt="Logo" className="h-14 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
        Acceso Administrativo
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo electrónico
          </Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sistema.com"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Contraseña
          </Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          {loading ? 'Verificando...' : 'Acceder'}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Requiere autenticación multifactor (MFA) obligatoria
        </p>
      </form>
    </motion.div>
  );

  // Registration Form
  const RegisterForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setAuthMode('selection')}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Volver
      </button>

      <div className="flex justify-center mb-6">
        <img src={Logo} alt="Logo" className="h-14 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
        Crear Cuenta
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reg-name">Nombre completo</Label>
          <Input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo electrónico
          </Label>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Contraseña
          </Label>
          <Input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-confirm">Confirmar contraseña</Label>
          <Input
            id="reg-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Los datos se guardarán en la base de datos y LDAP
        </p>
      </form>
    </motion.div>
  );

  // SSO Registration
  const SSORegisterForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setAuthMode('selection')}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Volver
      </button>

      <div className="flex justify-center mb-6">
        <img src={Logo} alt="Logo" className="h-14 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
        Registro Corporativo
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sso-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo electrónico corporativo
          </Label>
          <Input
            id="sso-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.com"
            required
            className="h-12"
          />
        </div>

        <Button
          onClick={handleSSORegister}
          className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          Continuar con SSO
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          El registro se sincronizará con la base de datos y LDAP corporativo
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="relative z-10 min-h-screen flex items-center justify-start px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-center">
                <AnimatePresence mode="wait">
                  {authMode === 'selection' && <SelectionMode key="selection" />}
                  {authMode === 'local' && <LocalLoginForm key="local" />}
                  {authMode === 'corporate' && <CorporateLoginForm key="corporate" />}
                  {authMode === 'admin' && <AdminLoginForm key="admin" />}
                  {authMode === 'register' && <RegisterForm key="register" />}
                  {authMode === 'register-sso' && <SSORegisterForm key="register-sso" />}
                </AnimatePresence>
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernAuthPage;
