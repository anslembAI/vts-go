import React, { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface RichCardProps {
    requestId: Id<"requests">;
    isSender: boolean;
}

const RichCard: React.FC<RichCardProps> = ({ requestId, isSender }) => {
    const request = useQuery(api.chat.getRequest, { requestId });
    const confirmReceipt = useMutation(api.chat.confirmRequest);
    const deleteRequest = useMutation(api.chat.deleteRequest);
    const [loading, setLoading] = useState(false);

    if (!request) return <div className="rich-card loading">Loading request...</div>;

    const handleConfirm = async () => {
        if (loading) return;
        setLoading(true);
        await confirmReceipt({ requestId });
        setLoading(false);
    };

    const handleDelete = async () => {
        if (loading) return;
        setLoading(true);
        await deleteRequest({ requestId });
        // Component will likely unmount as message is deleted
    };

    const isPending = request.status === 'pending';
    const totalTTD = (request.usd_amount * request.ttd_rate).toFixed(2);

    return (
        <div className={`rich-card ${isSender ? 'sent' : 'received'} ${request.status}`}>
            <div className="card-header">
                <span className="currency-label">USD Request</span>
                <span className={`status-badge ${request.status}`}>{request.status}</span>
            </div>

            <div className="amount-display">
                <span className="symbol">$</span>
                <span className="value">{request.usd_amount.toFixed(2)}</span>
            </div>

            <div className="details-row">
                <div className="detail-item">
                    <span className="label">Rate</span>
                    <span className="value">{request.ttd_rate.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Total TTD</span>
                    <span className="value highlight">${totalTTD}</span>
                </div>
            </div>

            {!isSender && isPending && (
                <button
                    className="confirm-btn"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Pay Request'}
                </button>
            )}

            {isSender && isPending && (
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Request'}
                </button>
            )}

            <style>{`
                .rich-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: var(--spacing-md);
                    width: 280px;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    margin-top: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .rich-card.sent {
                    border-color: var(--color-accent-dim);
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .status-badge {
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .status-badge.pending {
                    background: rgba(255, 193, 7, 0.2);
                    color: #FFC107;
                }
                .status-badge.received {
                    background: rgba(20, 255, 236, 0.2);
                    color: var(--color-accent);
                }
                .amount-display {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    display: flex;
                    align-items: baseline;
                }
                .amount-display .symbol {
                    font-size: 1.2rem;
                    margin-right: 4px;
                    color: var(--text-muted);
                }
                .details-row {
                    display: flex;
                    justify-content: space-between;
                    background: rgba(0,0,0,0.2);
                    padding: 8px;
                    border-radius: var(--radius-sm);
                }
                .detail-item {
                    display: flex;
                    flex-direction: column;
                }
                .detail-item .label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                }
                .detail-item .value {
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .detail-item .value.highlight {
                    color: var(--color-accent);
                }
                .confirm-btn {
                    margin-top: 8px;
                    background: var(--color-accent);
                    color: #000;
                    padding: 10px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .confirm-btn:hover {
                    opacity: 0.9;
                }
                .confirm-btn:disabled {
                    background: var(--text-muted);
                    cursor: not-allowed;
                }
                .delete-btn {
                    margin-top: 8px;
                    background: transparent;
                    color: #FF5252;
                    border: 1px solid #FF5252;
                    padding: 8px;
                    border-radius: var(--radius-sm);
                    font-size: 0.8rem;
                    transition: all 0.2s;
                }
                .delete-btn:hover {
                    background: rgba(255, 82, 82, 0.1);
                }
                .delete-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default RichCard;
