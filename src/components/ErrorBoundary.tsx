import React, { Component, ReactNode } from 'react';
import { AlertCircle, ChevronRight, RefreshCw, Sparkles } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#F4F8FF]">
          <div className="max-w-md w-full min-h-[680px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col">
            <div className="text-center mb-6">
              <p className="text-sm font-semibold tracking-wide uppercase text-blue-500 mb-3">
                Room 1221
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Something went wrong
              </h1>
              <p className="text-gray-500">
                The app ran into an unexpected error. Your session is still protected.
              </p>
            </div>

            <div className="mb-10 flex-1 flex items-center">
              <div className="mx-auto w-full max-w-sm h-72 rounded-3xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 flex items-center justify-center relative overflow-visible">
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-blue-100/70" />
                <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-emerald-100/70" />
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                  <div className="w-24 h-24 rounded-3xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200 mb-4">
                    <AlertCircle className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-7xl font-bold tracking-tighter text-gray-900 leading-none">Crash</p>
                  <p className="mt-3 text-sm text-gray-500 max-w-xs">
                    {this.state.error
                      ? this.state.error.toString()
                      : 'Something interrupted the experience. You can reload the app to continue.'}
                  </p>
                </div>
                <Sparkles className="absolute top-5 right-5 w-6 h-6 text-amber-400" />
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Error Details</h3>
                <p className="text-xs text-blue-700 font-mono break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                      Show stack trace
                    </summary>
                    <pre className="text-xs text-blue-700 mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload App
                <ChevronRight className="w-4 h-4 ml-2" />
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
