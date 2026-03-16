import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('parkscreen_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('parkscreen_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (accessToken, userData) => {
    localStorage.setItem('parkscreen_token', accessToken);
    localStorage.setItem('parkscreen_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('parkscreen_token');
    localStorage.removeItem('parkscreen_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in every component that needs auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}