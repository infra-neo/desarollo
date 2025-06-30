import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ServersPage from "./pages/ServersPage";
import MonitoringPage from "./pages/MonitoringPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RedirectToDashboard from "./components/common/RedirectRoute";
import { ServerProvider } from "./context/ServerContext";

function App() {
  return (
    <AuthProvider>
      <ServerProvider>
        <Toaster richColors position="top-center" />
        <Router>
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
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </ServerProvider>
    </AuthProvider>
  );
}

export default App;
