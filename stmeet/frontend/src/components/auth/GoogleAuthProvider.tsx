// auth/GoogleAuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

const API_URL = 'http://localhost:3000'; // Update this to match your server URL

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/status`, { withCredentials: true });
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirect to Google OAuth login
    window.location.href = `${API_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};