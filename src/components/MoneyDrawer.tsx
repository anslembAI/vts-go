import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const MoneyDrawer: React.FC<{ isOpen: boolean, onClose: () => void, chatId: string, userId: string }> = ({ isOpen, onClose, chatId, userId }) => {
    // chatId is indeed the conversationId here for simplicity
    const lastRate = useQuery(api.chat.getLastRate, { chatId }) || 6.80;

    const [amount, setAmount] = useState<string>('');
    const [rate, setRate] = useState<string>('6.80');
    const [calculating, setCalculating] = useState(false);

    const createRequest = useMutation(api.chat.createRequest);
    const saveRate = useMutation(api.chat.saveRate);

    useEffect(() => {
        if (lastRate) {
            setRate(lastRate.toString());
        }
    }, [lastRate]);

    const handleSend = async () => {
        if (!amount || !rate) return;
        setCalculating(true);

        const numRate = parseFloat(rate);

        await createRequest({
            usd_amount: parseFloat(amount),
            ttd_rate: numRate,
            author: userId,
            conversationId: chatId
        });

        await saveRate({ chatId, rate: numRate });

        setCalculating(false);
        setAmount('');
        onClose();
    };

    const ttdTotal = (parseFloat(amount || '0') * parseFloat(rate || '0'));

    return (
        <div className={`money-drawer ${isOpen ? 'open' : ''}`}>
            <div className="drawer-handle" onClick={onClose} />
            <div className="drawer-content">
                <h2>New Request</h2>

                <div className="input-group">
                    <label>USD Amount</label>
                    <div className="input-wrapper large">
                        <span className="prefix">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label>Rate (TTD)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>
                    <div className="result-display">
                        <label>Equivalent</label>
                        <div className="ttd-value">${ttdTotal.toFixed(2)} TTD</div>
                    </div>
                </div>

                <button className="send-btn" onClick={handleSend} disabled={!amount || calculating}>
                    {calculating ? 'Sending...' : 'Send Request'}
                </button>
            </div>

            <style>{`
                .money-drawer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: var(--bg-tertiary);
                    border-top-left-radius: var(--radius-lg);
                    border-top-right-radius: var(--radius-lg);
                    padding: var(--spacing-lg);
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
                    transform: translateY(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 100;
                    color: var(--text-primary);
                }
                .money-drawer.open {
                    transform: translateY(0);
                }
                .drawer-handle {
                    width: 40px;
                    height: 4px;
                    background: var(--text-muted);
                    border-radius: var(--radius-full);
                    margin: -10px auto 20px;
                    cursor: pointer;
                }
                .drawer-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }
                .input-group label {
                    display: block;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    border-bottom: 2px solid var(--text-muted);
                    transition: border-color 0.2s;
                }
                .input-wrapper:focus-within {
                    border-color: var(--color-accent);
                }
                .input-wrapper.large input {
                    font-size: 2.5rem;
                    font-weight: 300;
                    padding-left: 20px;
                }
                .prefix {
                    font-size: 1.5rem;
                    color: var(--text-muted);
                    position: absolute;
                    left: 0;
                }
                input {
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    width: 100%;
                    padding: 8px 0;
                    outline: none;
                    font-size: 1.2rem;
                }
                .input-row {
                    display: flex;
                    gap: var(--spacing-md);
                }
                .result-display .ttd-value {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--color-accent);
                }
                .send-btn {
                    background: var(--color-secondary);
                    color: white;
                    padding: 16px;
                    border-radius: var(--radius-md);
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-top: var(--spacing-md);
                    transition: transform 0.1s;
                }
                .send-btn:active {
                    transform: scale(0.98);
                }
                .send-btn:disabled {
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
};

export default MoneyDrawer;
