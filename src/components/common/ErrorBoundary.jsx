import React from "react";
import { AlertCircle, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className="mb-4 text-left bg-gray-100 p-3 rounded text-sm text-gray-700">
                <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
                <pre className="whitespace-pre-wrap break-words">{this.state.error.toString()}</pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
