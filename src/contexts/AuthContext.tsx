import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const login = async (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    try {
      const response = await api.get<User>('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user after login', error);
      // 로그인 실패 시 토큰/사용자 정보 정리
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };
  
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await api.get<User>('/users/me');
          setUser(response.data);
        } catch (error) {
          console.error('Invalid token, logging out', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 