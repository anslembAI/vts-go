
import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ChatListProps {
    currentUserId: string;
    onSelectChat: (friendId: string, friendName: string) => void;
    currentUserName: string;
}

const ChatList: React.FC<ChatListProps> = ({ currentUserId, onSelectChat, currentUserName }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // @ts-ignore
    const users = useQuery(api.users.getAll, { currentUserId: currentUserId as Id<"users"> });
    // @ts-ignore
    const me = useQuery(api.users.getMe, { userId: currentUserId as Id<"users"> });

    // @ts-ignore
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const updatePhoto = useMutation(api.users.updatePhoto);

    // Hidden file input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setIsMenuOpen(false);

        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();
            // @ts-ignore
            await updatePhoto({ userId: currentUserId, storageId });
        } catch (error) {
            console.error("Failed to upload photo:", error);
            alert("Failed to upload photo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="chat-list-container">
            {/* Header */}
            <header className="vts-header">
                <button className="back-btn">←</button>
                <div className="logo-title">
                    <span className="text-white">VTS</span>
                    <span className="text-teal">-GO</span>
                </div>
                <div style={{ width: 24 }}></div> {/* Spacer for balance */}
            </header>

            <div className="scroll-content">
                {/* Hero Profile Section */}
                <div className="hero-section">
                    <div className="hero-avatar-wrapper" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <div className={`hero-avatar ${uploading ? 'pulsing' : ''}`}>
                            {(me as any)?.imageUrl ? (
                                <img src={(me as any).imageUrl} alt="Me" />
                            ) : (
                                <div className="placeholder">{currentUserName?.[0]?.toUpperCase()}</div>
                            )}
                        </div>
                        {/* Photo Menu Popup */}
                        {isMenuOpen && (
                            <div className="photo-menu-popup">
                                <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                                    Take Photo
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                                    Choose from Library
                                </button>
                                <button className="danger" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}>
                                    Remove Photo
                                </button>
                            </div>
                        )}
                    </div>
                    <h3 className="hero-status">One of- Invite Friend</h3>
                </div>

                {/* List Content */}
                <div className="list-content">
                    {users === undefined ? (
                        <div className="loading">
                            Loading...
                        </div>
                    ) : users === null ? (
                        <div className="error-state">Failed to load users</div>
                    ) : users.length === 0 ? (
                        <p className="empty-state">No active chats.</p>
                    ) : (
                        users.map((user: any) => (
                            <div
                                key={user._id}
                                className="chat-row"
                                onClick={() => onSelectChat(user._id, user.fullName)}
                            >
                                <div className="row-avatar-wrapper">
                                    {user.imageUrl ? (
                                        <img src={user.imageUrl} className="row-avatar" alt={user.fullName} />
                                    ) : (
                                        <div className="row-avatar placeholder">{user.fullName[0].toUpperCase()}</div>
                                    )}
                                </div>

                                <div className="chat-info">
                                    <div className="chat-header-row">
                                        <h3 className="chat-name">{user.fullName}</h3>
                                        <span className="timestamp">0:16 88</span>
                                    </div>
                                    <div className="chat-preview-row">
                                        <span className="last-message">Lost te fhom</span>
                                        {/* Random badge for demo visuals */}
                                        {Math.random() > 0.7 && <div className="unread-badge">3</div>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden-input"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <style>{`
                .chat-list-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-primary);
                    color: white;
                    position: relative;
                    height: 100%; /* Force height */
                    min-height: 0; /* Important for flex child scrolling */
                }
                .vts-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: var(--bg-primary);
                }
                .back-btn {
                    background: none;
                    color: var(--color-accent);
                    font-size: 1.5rem;
                    padding: 0;
                }
                .logo-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                }
                .text-white { color: #fff; }
                .text-teal { color: var(--color-accent); }

                .scroll-content {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                /* Hero Section */
                .hero-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px 0 30px;
                    position: relative;
                }
                .hero-avatar-wrapper {
                    position: relative;
                    cursor: pointer;
                    z-index: 10;
                }
                .hero-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    padding: 3px;
                    background: var(--bg-primary);
                    border: 2px solid var(--color-secondary); /* Purple Border */
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(124, 77, 255, 0.2);
                }
                .hero-avatar img, .hero-avatar .placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .hero-avatar .placeholder {
                    background: var(--bg-tertiary);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--text-secondary);
                }
                .hero-status {
                    margin-top: 12px;
                    color: var(--text-secondary);
                    font-weight: 400;
                    font-size: 1rem;
                }

                /* Photo Menu Popup */
                .photo-menu-popup {
                    position: absolute;
                    top: 20px;
                    left: 110px; /* To the right of the avatar */
                    width: 180px;
                    background: rgba(30, 30, 36, 0.95);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--color-secondary);
                    border-radius: var(--radius-md);
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    animation: fadeIn 0.2s ease-out;
                }
                .photo-menu-popup button {
                    background: transparent;
                    color: white;
                    text-align: left;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .photo-menu-popup button:hover {
                    background: rgba(255,255,255,0.1);
                }
                .photo-menu-popup button.danger {
                    color: #FF5252;
                }

                /* List Content */
                .list-content {
                    flex: 1;
                    padding: 0 10px;
                }
                .chat-row {
                    display: flex;
                    align-items: center;
                    padding: 12px 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .chat-row:hover {
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                }
                .row-avatar-wrapper {
                    margin-right: 15px;
                }
                .row-avatar {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--color-secondary);
                }
                .row-avatar.placeholder {
                    background: var(--bg-tertiary);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    color: #fff;
                }
                .chat-info {
                    flex: 1;
                    min-width: 0;
                }
                .chat-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin-bottom: 4px;
                }
                .chat-name {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }
                .timestamp {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                }
                .chat-preview-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .last-message {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 180px;
                }
                .unread-badge {
                    background: var(--color-accent);
                    color: #000;
                    font-weight: bold;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.75rem;
                }

                .hidden-input { display: none; }
                .pulsing { animation: pulse 1.5s infinite; }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChatList;
