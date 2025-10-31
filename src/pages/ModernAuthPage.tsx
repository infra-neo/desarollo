import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
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
  Fingerprint,
  KeyRound,
  Smartphone
} from "lucide-react";
import Logo from "@/assets/logo/Logo_horizontal.png";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type AuthMode = 'selection' | 'local' | 'corporate' | 'admin';

const ModernAuthPage = () => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login({ email, password });
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleCorporateLogin = () => {
    // This will redirect to Authentik for corporate login
    toast.info('Redirigiendo a autenticación corporativa...');
    // TODO: Implement Authentik OIDC flow
    window.location.href = '/api/auth/authentik/login';
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Admin login uses the same endpoint but could have different validation
      await login({ email, password });
      toast.success('Acceso de administrador concedido');
    } catch (error) {
      toast.error('Error en autenticación de administrador');
    } finally {
      setLoading(false);
    }
  };

  // Animated background particles
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"
          style={{
            width: Math.random() * 300 + 50,
            height: Math.random() * 300 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
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
        <img src={Logo} alt="Logo" className="h-16 w-auto" />
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

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setAuthMode('local')}
            className="w-full h-16 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <User className="mr-3 h-6 w-6" />
            Inicia sesión con usuario y contraseña
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
            className="w-full h-16 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
          >
            <Building2 className="mr-3 h-6 w-6" />
            Inicia sesión cuenta corporativa
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
            className="w-full h-16 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
          >
            <Shield className="mr-3 h-6 w-6" />
            Inicia sesión administrador
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <p className="text-sm text-center text-gray-500 mb-4">
          Métodos de autenticación adicionales
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="WebAuthn / Touch ID / Face ID"
          >
            <Fingerprint className="h-6 w-6 text-gray-700" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Token físico"
          >
            <KeyRound className="h-6 w-6 text-gray-700" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="MFA / 2FA"
          >
            <Smartphone className="h-6 w-6 text-gray-700" />
          </motion.button>
        </div>
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
        <img src={Logo} alt="Logo" className="h-12 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
        Inicio de Sesión Local
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
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
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
        <img src={Logo} alt="Logo" className="h-12 w-auto" />
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
          Continuar con SSO / OIDC
        </Button>

        <div className="text-center text-sm text-gray-500 mt-4">
          Serás redirigido a Authentik para completar la autenticación
        </div>
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
        <img src={Logo} alt="Logo" className="h-12 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
        Acceso de Administrador
      </h2>

      <form onSubmit={handleAdminLogin} className="space-y-4">
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
          {loading ? 'Verificando...' : 'Acceder como Administrador'}
        </Button>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <BackgroundAnimation />
      
      <div className="relative z-10 min-h-screen flex items-center justify-start px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-xl bg-white/90 shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-center">
                <AnimatePresence mode="wait">
                  {authMode === 'selection' && <SelectionMode key="selection" />}
                  {authMode === 'local' && <LocalLoginForm key="local" />}
                  {authMode === 'corporate' && <CorporateLoginForm key="corporate" />}
                  {authMode === 'admin' && <AdminLoginForm key="admin" />}
                </AnimatePresence>
              </CardTitle>
            </CardHeader>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            <p>Powered by Authentik • Secure Authentication</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernAuthPage;
