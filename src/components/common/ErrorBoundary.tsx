import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-2xl w-full border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-6 h-6" />
                Algo salió mal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-red-600">
                  La aplicación encontró un error inesperado. Por favor, intenta recargar la página.
                </p>
                {this.state.error && (
                  <div className="p-4 bg-white rounded border border-red-200">
                    <p className="font-mono text-sm text-gray-800">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={this.handleReset} variant="default">
                    Intentar de nuevo
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/"}
                    variant="outline"
                  >
                    Ir al inicio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
