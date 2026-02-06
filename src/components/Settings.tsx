
import React, { useState, useRef } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface SettingsProps {
    userId: string;
    currentUser: any;
    onLogout: () => void;
    onOpenAdmin: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userId, currentUser, onLogout, onOpenAdmin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

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
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload to Convex Storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Save storageId to user profile
            await updatePhoto({
                userId: userId as Id<"users">,
                storageId: storageId
            });

        } catch (error) {
            console.error("Failed to upload photo:", error);
            alert("Failed to upload photo. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h2>Settings</h2>
            </header>

            <div className="profile-section">
                <div
                    className="avatar-container"
                    onClick={() => setIsMenuOpen(true)}
                >
                    {uploading ? (
                        <div className="avatar-loading">...</div>
                    ) : currentUser?.imageUrl ? (
                        <img src={currentUser.imageUrl} alt="Profile" className="profile-avatar" />
                    ) : (
                        <div className="default-avatar">{currentUser?.fullName?.[0] || "?"}</div>
                    )}
                    <div className="edit-badge">📷</div>
                </div>
                <h3>{currentUser?.fullName}</h3>
                <span className="status-text">Available</span>
            </div>

            <div className="settings-list">
                {currentUser?.isAdmin && (
                    <div className="setting-item" onClick={onOpenAdmin}>
                        <span className="icon">🛡️</span>
                        <span>Admin Panel</span>
                    </div>
                )}
                <div className="setting-item" onClick={onLogout}>
                    <span className="icon">🚪</span>
                    <span>Sign Out</span>
                </div>
            </div>

            {/* Photo Menu Overlay */}
            {isMenuOpen && (
                <div className="photo-menu-overlay" onClick={() => setIsMenuOpen(false)}>
                    <div className="photo-menu" onClick={e => e.stopPropagation()}>
                        <h3>Change Profile Photo</h3>
                        <button onClick={() => fileInputRef.current?.click()}>
                            Choose from Library
                        </button>
                        <button className="cancel" onClick={() => setIsMenuOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden-input"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <style>{`
                .settings-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }
                .settings-header {
                    padding: 20px;
                    border-bottom: 1px solid var(--glass-border);
                }
                .profile-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                    border-bottom: 1px solid var(--glass-border);
                }
                .avatar-container {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    cursor: pointer;
                    margin-bottom: 16px;
                }
                .profile-avatar {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid var(--color-secondary);
                }
                .default-avatar {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: var(--color-accent);
                    color: #000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 2.5rem;
                    font-weight: bold;
                    border: 3px solid var(--color-secondary);
                }
                .edit-badge {
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    background: var(--bg-tertiary);
                    border-radius: 50%;
                    padding: 6px;
                    font-size: 1.2rem;
                    border: 2px solid var(--bg-primary);
                }
                .status-text {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                
                .settings-list {
                    padding: 20px;
                }
                .setting-item {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                    margin-bottom: 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .setting-item:hover {
                    background: var(--bg-tertiary);
                }
                .setting-item .icon {
                    margin-right: 15px;
                    font-size: 1.2rem;
                }

                .photo-menu-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 100;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end; /* Bottom sheet style on mobile, or center on desktop */
                }
                .photo-menu {
                    background: var(--bg-secondary);
                    width: 100%;
                    max-width: 400px;
                    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
                    padding: 20px;
                    animation: slideUp 0.3s ease-out;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                @media (min-width: 600px) {
                    .photo-menu-overlay {
                        align-items: center;
                    }
                    .photo-menu {
                        border-radius: var(--radius-lg);
                    }
                }
                .photo-menu button {
                    padding: 16px;
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border-radius: var(--radius-md);
                    font-size: 1rem;
                    text-align: center;
                }
                .photo-menu button.cancel {
                    background: transparent;
                    color: #FF5252;
                    margin-top: 10px;
                }
                .hidden-input {
                    display: none;
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Settings;
