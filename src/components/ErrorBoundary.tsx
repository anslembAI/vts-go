
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <h2>Something went wrong</h2>
                    <p className="error-text">{this.state.error?.message || "Unknown Error"}</p>
                    <button
                        className="reset-btn"
                        onClick={() => {
                            if (this.props.onReset) {
                                this.props.onReset();
                            } else {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                    >
                        Reset App & Sign Out
                    </button>
                    <style>{`
            .error-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: #121212;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .error-text {
              color: #ff5252;
              margin: 10px 0 20px;
              max-width: 600px;
            }
            .reset-btn {
              background: #7C4DFF;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 9999px;
              font-size: 1rem;
              cursor: pointer;
              transition: transform 0.2s;
            }
            .reset-btn:hover {
              transform: scale(1.05);
            }
          `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
