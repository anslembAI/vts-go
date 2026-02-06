
import React from 'react';

// Icons using SVG for no dependencies
const ChatIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#14FFEC" : "none"} stroke={active ? "#14FFEC" : "#a0a0a0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const FriendsIcon = ({ active }: { active: boolean }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? "#14FFEC" : "#a0a0a0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const SettingsIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#14FFEC" : "#a0a0a0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

interface BottomNavProps {
    activeTab: 'chats' | 'friends' | 'settings';
    onTabChange: (tab: 'chats' | 'friends' | 'settings') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="bottom-nav">
            <button
                className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
                onClick={() => onTabChange('chats')}
            >
                <ChatIcon active={activeTab === 'chats'} />
                <span>Chats</span>
            </button>
            <button
                className={`nav-item ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => onTabChange('friends')}
            >
                <FriendsIcon active={activeTab === 'friends'} />
                <span>Friends</span>
            </button>
            <button
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
            >
                <SettingsIcon active={activeTab === 'settings'} />
                <span>Settings</span>
            </button>

            <style>{`
                .bottom-nav {
                    display: flex;
                    justify-content: space-around;
                    background: #181818;
                    padding: 12px 0 24px; /* Added extra padding for iOS home bar area */
                    border-top: 1px solid rgba(255,255,255,0.05);
                    position: sticky;
                    bottom: 0;
                    margin-bottom: constant(safe-area-inset-bottom);
                    margin-bottom: env(safe-area-inset-bottom);
                }
                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: none;
                    gap: 6px;
                    width: 60px;
                    cursor: pointer;
                }
                .nav-item span {
                    font-size: 0.65rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
                .nav-item.active span {
                    color: var(--color-accent);
                }
            `}</style>
        </div>
    );
};

export default BottomNav;
