import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const BalanceDashboard: React.FC = () => {
    const balance = useQuery(api.chat.getBalance);

    if (!balance) return <div className="balance-dashboard loading">Loading balances...</div>;

    return (
        <div className="balance-dashboard">
            <div className="balance-card">
                <h3>Total Pending</h3>
                <div className="amount usd">
                    ${balance.pendingUSD.toFixed(2)} <span className="currency">USD</span>
                </div>
            </div>

            <div className="balance-card highlight">
                <h3>Total Received</h3>
                <div className="amount ttd">
                    ${balance.receivedTTD.toFixed(2)} <span className="currency">TTD</span>
                </div>
            </div>

            <style>{`
                .balance-dashboard {
                    padding: var(--spacing-md);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--glass-border);
                    animation: slideDown 0.3s ease;
                }
                .balance-card {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--glass-border);
                }
                .balance-card.highlight {
                    border-color: var(--color-accent-dim);
                    background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(20, 255, 236, 0.05) 100%);
                }
                h3 {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-bottom: 4px;
                    text-transform: uppercase;
                }
                .amount {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .amount.ttd {
                    color: var(--color-accent);
                }
                .currency {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default BalanceDashboard;
