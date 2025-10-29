import { Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ServersPage from "./pages/ServersPage";
import MonitoringPage from "./pages/MonitoringPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import SwaggerUIPage from "./pages/SwaggerUIPage";
import WorkspacePage from "./pages/WorkspacePage";
import InstallationProgress from "./pages/InstallationProgress";
import VMListPage from "./pages/VMListPage";
import CloudsPage from "./pages/CloudsPage";
import CloudVMsPage from "./pages/CloudVMsPage";
import MachineRegistrationPage from "./pages/MachineRegistrationPage";
import RegisteredMachinesPage from "./pages/RegisteredMachinesPage";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RedirectToDashboard from "./components/common/RedirectRoute";
import { ServerProvider } from "./context/ServerContext";

function App() {
  return (
    <AuthProvider>
      <ServerProvider>
        <Toaster richColors position="top-center" />

        <Routes>
          <Route
            path="/auth"
            element={
              <RedirectToDashboard>
                <AuthPage />
              </RedirectToDashboard>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servers"
            element={
              <ProtectedRoute>
                <ServersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitoring"
            element={
              <ProtectedRoute>
                <MonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swagger-ui"
            element={
              <ProtectedRoute>
                <SwaggerUIPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/installation"
            element={
              <ProtectedRoute>
                <InstallationProgress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vms"
            element={
              <ProtectedRoute>
                <VMListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clouds"
            element={
              <ProtectedRoute>
                <CloudsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clouds/:cloudId/vms"
            element={
              <ProtectedRoute>
                <CloudVMsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/machine-registration"
            element={
              <ProtectedRoute>
                <MachineRegistrationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/registered-machines"
            element={
              <ProtectedRoute>
                <RegisteredMachinesPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ReactQueryDevtools initialIsOpen={false} />
      </ServerProvider>
    </AuthProvider>
  );
}

export default App;
