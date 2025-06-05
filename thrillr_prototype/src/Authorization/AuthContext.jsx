
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';


function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 3600 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : undefined;
}


function deleteCookie(name) {
  document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/`;
}


const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  signup: async (username, password) => ({ success: false }),
  login: async (username, password) => ({ success: false }),
  logout: () => {}
});


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const logoutTimerRef = useRef(null);

  const clearSessionData = useCallback(() => {
    deleteCookie('sessionUser');
    localStorage.removeItem('sessionExpiry');
    setCurrentUser(null);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  // ─── Internal: perform actual logout (used by timer or manual logout) ─────
  const performLogout = useCallback(() => {
    // Fire a cross‐tab event:
    localStorage.setItem(
      'auth-event',
      JSON.stringify({ type: 'logout', timestamp: Date.now() })
    );
    clearSessionData();
  }, [clearSessionData]);

  // ─── On mount: check for existing session cookie & expiry ─────────────────
  useEffect(() => {
    const savedCookieUser = getCookie('sessionUser');
    const expiryRaw = localStorage.getItem('sessionExpiry');
    const expiryTs = expiryRaw ? Number(expiryRaw) : null;
    const now = Date.now();

    if (savedCookieUser && expiryTs && now < expiryTs) {
      // Session is still valid. Restore state and schedule logout for remaining time.
      setCurrentUser(savedCookieUser);

      const timeLeft = expiryTs - now;
      logoutTimerRef.current = setTimeout(() => {
        performLogout();
      }, timeLeft);
    } else {
      // Either no cookie or expiry passed. Ensure everything is cleared.
      clearSessionData();
    }
  }, [performLogout, clearSessionData]);

  // ─── Cross‐tab sync: listen to 'storage' events for login/logout ───────────
  useEffect(() => {
    function handleStorageEvent(e) {
      if (e.key === 'auth-event' && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          if (event.type === 'logout') {
            // Another tab logged out → clear our session too
            clearSessionData();
          }
          if (event.type === 'login') {
            // Another tab logged in → restore user and schedule logout
            const { username, expiryTs } = event;
            setCurrentUser(username);
            // Calculate how many hours remain until expiry
            const hoursLeft = (expiryTs - Date.now()) / (3600 * 1000);
            if (hoursLeft > 0) {
              // Reset cookie for remaining hours
              setCookie('sessionUser', username, hoursLeft);
              if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
              logoutTimerRef.current = setTimeout(() => {
                performLogout();
              }, expiryTs - Date.now());
            } else {
              clearSessionData();
            }
          }
        } catch {
        }
      }
    }

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [performLogout, clearSessionData]);

  function logout() {
    performLogout();
  }

  const createSession = useCallback((username) => {
    const oneHourMs = 3600 * 1000;
    const expiryTs = Date.now() + oneHourMs;

    // 1) Cookie holds the username, expires in 1 hour
    setCookie('sessionUser', username, 1);

    // 2) localStorage holds the absolute expiry timestamp
    localStorage.setItem('sessionExpiry', String(expiryTs));

    // 3) Schedule auto‐logout after exactly 1 hour
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      performLogout();
    }, oneHourMs);

    // 4) Fire a cross‐tab “login” event
    localStorage.setItem(
      'auth-event',
      JSON.stringify({ type: 'login', username, expiryTs })
    );

    // 5) Update React state
    setCurrentUser(username);
  }, [performLogout]);

  // ─── SIGN UP: store new user in localStorage, then auto‐login ─────────────
  async function signup(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Username & password required.' };
    }

    // Load existing users
    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : {};

    if (users[username]) {
      return { success: false, message: 'Username already taken.' };
    }

    // Add new user
    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));

    createSession(username);
    return { success: true };
  }


  async function login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Username & password required.' };
    }

    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : {};

    if (!users[username] || users[username].password !== password) {
      return { success: false, message: 'Invalid credentials.' };
    }

    createSession(username);
    return { success: true };
  }

  // ─── Build Context Value ─
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
