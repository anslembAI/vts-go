import React, { useEffect, useState } from 'react';
import '../index.css';

const WifiGatekeeper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isWifi, setIsWifi] = useState<boolean>(true);

    useEffect(() => {
        const checkConnection = () => {
            // @ts-ignore - Network Information API is not fully typed in all TS envs
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                // 'wifi' is standard, but some browsers might return '4g'/'3g' etc.
                // We'll treat cellular types as restricted.
                // If type is not available or unknown, we default to unlocked.
                const type = connection.type;
                const effectiveType = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g' on some browsers

                console.log("Connection Info:", { type, effectiveType });

                // Logic: if explicitly cellular, lock it.
                if (type === 'cellular' || type === 'bluetooth' || type === 'none') {
                    setIsWifi(false);
                }
                // Some browsers like Chrome on Desktop might always return 'unknown' or 'other'. 
                // We'll strictly guard against known mobile data types if we can detect them.
                else {
                    setIsWifi(true);
                }
            }
        };

        checkConnection();
        // @ts-ignore
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', checkConnection);
            return () => connection.removeEventListener('change', checkConnection);
        }
    }, []);

    if (isWifi) {
        return <>{children}</>;
    }

    return (
        <div className="gatekeeper-overlay">
            <div className="gatekeeper-content">
                <div className="wifi-icon-large">
                    {/* Simple Broken Wifi Icon via CSS/SVG */}
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 18C12 18 12 18 12 18ZM15.5355 14.4645C16.4729 13.5271 17 12.2323 17 10.9063C17 9.58028 16.473 8.28551 15.5355 7.34808L15.5355 7.34808C13.5829 5.39546 10.4171 5.39546 8.46447 7.34808C7.52703 8.28552 7.00004 9.58029 7.00004 10.9063C7.00004 12.2323 7.52712 13.5271 8.46447 14.4645M3 3L21 21" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="#FF5252" strokeOpacity="1" strokeWidth="2" />
                    </svg>
                </div>
                <h1>Connection Restricted</h1>
                <p>Local Mode Only. Please connect to Wi-Fi to proceed.</p>
                <button className="reconnect-btn" onClick={() => window.location.reload()}>
                    Check Connection
                </button>
                <div style={{ marginTop: '20px' }}>
                    <button
                        className="logout-link"
                        onClick={() => {
                            localStorage.removeItem("vts_user");
                            window.location.reload();
                        }}
                    >
                        Sign Out / Reset
                    </button>
                </div>
            </div>
            <style>{`
        .gatekeeper-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(18, 18, 18, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .gatekeeper-content {
          text-align: center;
          color: var(--text-primary);
          animation: fadeIn 0.5s ease;
        }
        .reconnect-btn {
          margin-top: var(--spacing-lg);
          background: var(--color-accent);
          color: #000;
          padding: 12px 24px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 1rem;
          transition: transform 0.2s;
        }
        .reconnect-btn:active {
            transform: scale(0.95);
        }
        .logout-link {
            background: none;
            border: none;
            color: var(--text-muted);
            text-decoration: underline;
            font-size: 0.9rem;
            cursor: pointer;
        }
        .logout-link:hover {
            color: var(--color-accent);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default WifiGatekeeper;
