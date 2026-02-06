import { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import Chat from "./components/Chat";
import AuthModal from "./components/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";

import UserList from "./components/UserList";

// Getting the convex URL from environment variables
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);


import BottomNav from "./components/BottomNav";
import ChatList from "./components/ChatList";
import Settings from "./components/Settings";

// ... (existing imports, but remove direct UserList logic if better handled here)

function App() {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<{ id: string, name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'settings'>('chats');

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

  // If user has a profile picture (enriched by getMe), we update our local knowledge strictly if needed
  // ... (for now 'me' query is enough to pass down)

  return (
    <ConvexProvider client={convex}>

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
                    />
                  </ErrorBoundary>
                )}
              </main>
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          ) : null}
        </div>
      </ErrorBoundary>

    </ConvexProvider>
  );
}

// Add Main Layout CSS in App.css or here
// .main-layout { display: flex; flex-direction: column; height: 100vh; }
// .tab-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }


export default App;
