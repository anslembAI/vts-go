import React, { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AuthModalProps {
    onLogin: (userId: string, fullName: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = useMutation(api.auth.login);
    const register = useMutation(api.auth.register);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const userId = await register({ fullName, password });
                onLogin(userId, fullName);
            } else {
                const userId = await login({ fullName, password });
                onLogin(userId, fullName);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-card">
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <p className="toggle-mode">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? ' Sign In' : ' Sign Up'}
                    </span>
                </p>
            </div>

            <style>{`
                .auth-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                }
                .auth-card {
                    background: var(--bg-secondary);
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                h2 {
                    text-align: center;
                    margin-bottom: 24px;
                    color: var(--color-accent);
                }
                .input-group {
                    margin-bottom: 20px;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .input-group input {
                    width: 100%;
                    padding: 12px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--glass-border);
                    background: var(--bg-tertiary);
                    color: white;
                    font-size: 1rem;
                }
                .input-group input:focus {
                    border-color: var(--color-accent);
                    outline: none;
                }
                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: var(--color-secondary);
                    color: white;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    margin-top: 10px;
                    transition: opacity 0.2s;
                }
                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .toggle-mode {
                    text-align: center;
                    margin-top: 20px;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .toggle-mode span {
                    color: var(--color-accent);
                    cursor: pointer;
                    font-weight: 600;
                    margin-left: 5px;
                }
                .error-message {
                    background: rgba(255, 82, 82, 0.1);
                    color: #FF5252;
                    padding: 10px;
                    border-radius: var(--radius-sm);
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
};

export default AuthModal;
