import { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import WifiGatekeeper from "./components/WifiGatekeeper";
import Chat from "./components/Chat";
import AuthModal from "./components/AuthModal";

import UserList from "./components/UserList";

// Getting the convex URL from environment variables
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<{ id: string, name: string } | null>(null);

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
    // Force reload to clear any cached states
    window.location.reload();
  };

  return (
    <ConvexProvider client={convex}>
      <WifiGatekeeper>
        <div className="app-container">
          {!user && <AuthModal onLogin={handleLogin} />}

          {user && !selectedFriend && (
            <UserList
              currentUserId={user.id}
              onSelectUser={(id, name) => setSelectedFriend({ id, name })}
              onLogout={handleLogout}
            />
          )}

          {user && selectedFriend && (
            <Chat
              userId={user.id}
              userName={user.name}
              friendId={selectedFriend.id}
              friendName={selectedFriend.name}
              onBack={() => setSelectedFriend(null)}
            />
          )}
        </div>
      </WifiGatekeeper>
    </ConvexProvider>
  );
}

export default App;
