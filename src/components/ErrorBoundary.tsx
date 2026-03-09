import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to the console
    console.error('🔴 ERROR BOUNDARY CAUGHT AN ERROR:', error);
    console.error('🔴 ERROR INFO:', errorInfo);
    console.error('🔴 COMPONENT STACK:', errorInfo.componentStack);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
              Oops! Something went wrong
            </h1>
            
            <p className="text-center text-gray-600 mb-6">
              Room 1221 encountered an unexpected error. Don't worry, your privacy is still protected.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                <h3 className="text-sm font-semibold text-red-700 mb-2">Error Details:</h3>
                <p className="text-xs text-red-600 font-mono break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 cursor-pointer hover:text-red-700">
                      Show stack trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                  boxShadow: '0 4px 16px rgba(0, 72, 255, 0.2)',
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload App
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              If this problem persists, please check the browser console for more details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
