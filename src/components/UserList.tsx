import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface UserListProps {
    currentUserId: string;
    onSelectUser: (friendId: string, friendName: string) => void;
    onLogout: () => void;
}

const UserList: React.FC<UserListProps> = ({ currentUserId, onSelectUser, onLogout }) => {
    // @ts-ignore
    const users = useQuery(api.users.getAll, { currentUserId: currentUserId as Id<"users"> });

    if (!users) return <div className="loading">Loading contacts...</div>;

    return (
        <div className="user-list-container">
            <header className="list-header">
                <h2>Contacts</h2>
                <button className="logout-btn" onClick={onLogout}>Sign Out</button>
            </header>

            <div className="list-content">
                {users.length === 0 ? (
                    <p className="empty-state">No other users found.</p>
                ) : (
                    users.map((user: any) => (
                        <div
                            key={user._id}
                            className="user-item"
                            onClick={() => onSelectUser(user._id, user.fullName)}
                        >
                            <div className="avatar">{user.fullName[0].toUpperCase()}</div>
                            <div className="info">
                                <h3>{user.fullName}</h3>
                                <span className="status">Online</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .user-list-container {
                    height: 100vh;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    display: flex;
                    flex-direction: column;
                }
                .list-header {
                    padding: 20px;
                    border-bottom: 1px solid var(--glass-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .list-header h2 {
                    color: var(--color-accent);
                }
                .logout-btn {
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                }
                .list-content {
                    flex: 1;
                    padding: 10px;
                    overflow-y: auto;
                }
                .user-item {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-bottom: 5px;
                }
                .user-item:hover {
                    background: var(--bg-secondary);
                }
                .avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-secondary), #5a35b5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: 700;
                    margin-right: 15px;
                    box-shadow: 0 2px 10px rgba(124, 77, 255, 0.3);
                }
                .info h3 {
                    font-size: 1rem;
                    margin-bottom: 4px;
                }
                .info .status {
                    font-size: 0.75rem;
                    color: #00C853; /* Online green */
                }
                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default UserList;
