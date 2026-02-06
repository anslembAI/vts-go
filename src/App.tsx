import { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import Chat from "./components/Chat";
import AuthModal from "./components/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";
import UserList from "./components/UserList";
import BottomNav from "./components/BottomNav";
import ChatList from "./components/ChatList";
import Settings from "./components/Settings";
import AdminPanel from "./components/AdminPanel";

// Getting the convex URL from environment variables
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Inner component that uses Convex hooks (must be inside ConvexProvider)
function AppContent() {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<{ id: string, name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'settings'>('chats');
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Added state

  console.log("App Render. User:", user, "SelectedFriend:", selectedFriend, "ActiveTab:", activeTab);
  console.log("Convex URL:", import.meta.env.VITE_CONVEX_URL);

  // Use a query to get current user details strictly if needed, mainly for photo
  const me = useQuery(api.users.getMe, user ? { userId: user.id as any } : "skip");

  useEffect(() => {
    const storedUser = localStorage.getItem("vts_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userId: string, fullName: string) => {
    const userData = { id: userId, name: fullName };
    setUser(userData);
    localStorage.setItem("vts_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedFriend(null);
    localStorage.removeItem("vts_user");
    window.location.reload();
  };

  return (
    <ErrorBoundary onReset={handleLogout}>
      <div className="app-container">
        {!user && <AuthModal onLogin={handleLogin} />}

        {user && selectedFriend ? (
          <ErrorBoundary onReset={() => setSelectedFriend(null)}>
            <Chat
              userId={user.id}
              userName={user.name}
              friendId={selectedFriend.id}
              friendName={selectedFriend.name}
              onBack={() => setSelectedFriend(null)}
            />
          </ErrorBoundary>
        ) : user ? (
          <div className="main-layout">
            <main className="tab-content">
              {activeTab === 'chats' && (
                <ErrorBoundary onReset={handleLogout}>
                  <ChatList
                    currentUserId={user.id}
                    currentUserName={user.name}
                    onSelectChat={(id, name) => setSelectedFriend({ id, name })}
                  />
                </ErrorBoundary>
              )}
              {activeTab === 'friends' && (
                <ErrorBoundary onReset={handleLogout}>
                  <UserList
                    currentUserId={user.id}
                    currentUserName={user.name}
                    onSelectUser={(id, name) => setSelectedFriend({ id, name })}
                    onLogout={handleLogout}
                  />
                </ErrorBoundary>
              )}
              {activeTab === 'settings' && (
                <ErrorBoundary onReset={handleLogout}>
                  <Settings
                    userId={user.id}
                    currentUser={me || { fullName: user.name }}
                    onLogout={handleLogout}
                    onOpenAdmin={() => setShowAdminPanel(true)}
                  />
                </ErrorBoundary>
              )}

              {showAdminPanel && (
                <AdminPanel
                  userId={user.id}
                  isAdmin={me?.isAdmin}
                  onClose={() => setShowAdminPanel(false)}
                />
              )}
            </main>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        ) : null}
      </div>
    </ErrorBoundary>
  );
}

// Outer component that provides ConvexProvider context
function App() {
  return (
    <ConvexProvider client={convex}>
      <AppContent />
    </ConvexProvider>
  );
}

export default App;

