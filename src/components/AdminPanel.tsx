import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AdminPanelProps {
    userId: string;
    isAdmin?: boolean;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ userId, isAdmin, onClose }) => {
    const currentRate = useQuery(api.admin.getStandardRate);
    const updateRate = useMutation(api.admin.setStandardRate);
    const promoteMe = useMutation(api.admin.promoteToAdmin);

    const [rateInput, setRateInput] = useState('');
    const [secret, setSecret] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (currentRate !== undefined) {
            setRateInput(currentRate.toString());
        }
    }, [currentRate]);

    const handleSaveRate = async () => {
        try {
            await updateRate({ userId: userId as any, rate: parseFloat(rateInput) });
            setMsg("Rate updated successfully!");
            setTimeout(() => setMsg(''), 3000);
        } catch (e: any) {
            setMsg("Error: " + e.message);
        }
    };

    const handlePromote = async () => {
        try {
            await promoteMe({ userId: userId as any, secret });
            setMsg("You are now an admin! Refreshing...");
            setTimeout(() => window.location.reload(), 1500);
        } catch (e: any) {
            setMsg("Error: " + e.message);
        }
    };

    if (!isAdmin) {
        return (
            <div className="admin-panel restricted">
                <div className="header">
                    <h2>Admin Access</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="content">
                    <p>You do not have administrative privileges.</p>
                    <div className="promote-section">
                        <label>Admin Secret</label>
                        <input
                            type="password"
                            value={secret}
                            onChange={e => setSecret(e.target.value)}
                            placeholder="Enter secret to become admin"
                        />
                        <button onClick={handlePromote}>Unlock Admin</button>
                    </div>
                    {msg && <p className="msg">{msg}</p>}
                </div>
                <style>{`
                    .admin-panel {
                        position: fixed;
                        top: 50%; left: 50%;
                        transform: translate(-50%, -50%);
                        background: var(--bg-secondary);
                        border: 1px solid var(--glass-border);
                        padding: 30px;
                        border-radius: var(--radius-lg);
                        z-index: 2000;
                        width: 90%;
                        max-width: 400px;
                        color: var(--text-primary);
                        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .close-btn {
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: var(--text-secondary);
                        cursor: pointer;
                    }
                    .promote-section {
                        margin-top: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    input {
                        padding: 10px;
                        border-radius: var(--radius-md);
                        background: var(--bg-tertiary);
                        border: 1px solid var(--text-muted);
                        color: white;
                    }
                    button {
                        padding: 10px;
                        background: var(--color-accent);
                        border: none;
                        border-radius: var(--radius-md);
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                    }
                    .msg { margin-top: 10px; color: var(--color-accent); }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="header">
                <h2>Admin Settings</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="setting-group">
                <label>Standard Exchange Rate (TTD per USD)</label>
                <div className="input-row">
                    <input
                        type="number"
                        step="0.01"
                        value={rateInput}
                        onChange={e => setRateInput(e.target.value)}
                    />
                    <button onClick={handleSaveRate}>Update Rate</button>
                </div>
                <p className="help-text">This rate will be used as the default for new conversations.</p>
            </div>

            {msg && <p className="msg">{msg}</p>}

            <style>{`
                .admin-panel {
                    position: fixed;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    padding: 30px;
                    border-radius: var(--radius-lg);
                    z-index: 2000;
                    width: 90%;
                    max-width: 500px;
                    color: var(--text-primary);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -48%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid var(--glass-border);
                    padding-bottom: 15px;
                }
                .header h2 { margin: 0; color: var(--color-accent); }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    line-height: 1;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0;
                }
                .setting-group label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: 500;
                    color: var(--text-secondary);
                }
                .input-row {
                    display: flex;
                    gap: 10px;
                }
                .input-row input {
                    flex: 1;
                    padding: 12px;
                    border-radius: var(--radius-md);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--text-muted);
                    color: white;
                    font-size: 1.1rem;
                }
                .input-row button {
                    padding: 0 20px;
                    background: var(--color-secondary);
                    border: none;
                    border-radius: var(--radius-md);
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .input-row button:hover { opacity: 0.9; }
                .help-text {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-top: 8px;
                }
                .msg {
                    margin-top: 20px;
                    padding: 10px;
                    background: rgba(76, 175, 80, 0.1);
                    color: #4CAF50;
                    border-radius: var(--radius-sm);
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
