import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import RichCard from './RichCard';
import MoneyDrawer from './MoneyDrawer';
import BalanceDashboard from './BalanceDashboard';

interface ChatProps {
    userId: string;
    userName: string;
    friendId: string;
    friendName: string;
    onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ userId, userName, friendId, friendName, onBack }) => {
    const [text, setText] = useState('');
    const [isBalanceOpen, setIsBalanceOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Generate simple conversation ID (sort ids to ensure uniqueness regardless of initiator)
    const conversationId = [userId, friendId].sort().join("_");

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages = useQuery(api.chat.listMessages, { conversationId }) || [];
    const sendMessage = useMutation(api.chat.sendMessage);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        await sendMessage({ body: text, author: userId, conversationId });
        setText('');
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <header className="chat-header">
                <button className="back-btn" onClick={onBack}>←</button>
                <div className="friend-info">
                    <div className="avatar">{friendName[0]}</div>
                    <div className="details">
                        <h2>{friendName}</h2>
                        <span className="status">Online</span>
                        <span className="user-label">Logged in as: {userName}</span>
                    </div>
                </div>
                <button
                    className={`balance-toggle ${isBalanceOpen ? 'active' : ''}`}
                    onClick={() => setIsBalanceOpen(!isBalanceOpen)}
                >
                    Balance
                </button>
            </header>

            {/* Dashboard Area */}
            {isBalanceOpen && <BalanceDashboard />}

            {/* Messages Area */}
            <div className="messages-area">
                {messages.map((msg: any, idx: number) => {
                    const isMe = msg.author === userId;
                    return (
                        <div key={idx} className={`message-row ${isMe ? 'me' : 'them'}`}>
                            {msg.type === 'text' ? (
                                <div className="message-bubble">{msg.body}</div>
                            ) : msg.requestId ? (
                                <RichCard requestId={msg.requestId} isSender={isMe} />
                            ) : null}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
                <button className="action-btn" onClick={() => setIsDrawerOpen(true)}>
                    +
                </button>
                <form onSubmit={handleSend} className="text-form">
                    <input
                        type="text"
                        placeholder="Message..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </form>
            </div>

            {/* Money Drawer */}
            <MoneyDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                chatId={conversationId}
                userId={userId}
            />

            <style>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background: var(--bg-primary);
                }
                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-md);
                    background: rgba(18, 18, 18, 0.8);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--glass-border);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .back-btn {
                    background: none;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    margin-right: 10px;
                    padding: 4px;
                    border: none;
                    cursor: pointer;
                }
                .friend-info {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                }
                .details h2 {
                    font-size: 1rem;
                    margin: 0;
                }
                .details .status {
                    font-size: 0.7rem;
                    color: var(--color-accent);
                    display: block;
                }
                .user-label {
                    font-size: 0.6rem;
                    color: var(--text-muted);
                    display: block;
                    margin-top: 2px;
                }
                .back-btn {
                    background: none;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    margin-right: 10px;
                    padding: 4px;
                }
                .balance-toggle {
                    background: transparent;
                    color: var(--text-secondary);
                    border: 1px solid var(--glass-border);
                    padding: 6px 12px;
                    border-radius: var(--radius-full);
                    font-size: 0.8rem;
                }
                .balance-toggle.active {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border-color: var(--text-secondary);
                }
                
                .messages-area {
                    flex: 1;
                    padding: var(--spacing-md);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .message-row {
                    display: flex;
                }
                .message-row.me {
                    justify-content: flex-end;
                }
                .message-row.them {
                    justify-content: flex-start;
                }
                .message-bubble {
                    max-width: 70%;
                    padding: 10px 16px;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    line-height: 1.4;
                }
                .message-row.me .message-bubble {
                    background: var(--color-accent);
                    color: #000;
                    border-bottom-right-radius: 4px;
                }
                .message-row.them .message-bubble {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border-bottom-left-radius: 4px;
                }

                .input-area {
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .action-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.2s;
                }
                .action-btn:hover {
                    background: var(--color-secondary);
                }
                .text-form {
                    flex: 1;
                }
                .text-form input {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: var(--radius-full);
                    border: none;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: 1rem;
                }
                .text-form input:focus {
                    outline: 1px solid var(--color-accent);
                }
            `}</style>
        </div>
    );
};

export default Chat;
