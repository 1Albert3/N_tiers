import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

type AuthContextType = {
  token?: string | null;
  user?: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  async function signIn(email: string, password: string) {
    const res = await apiLogin({ email, password });
    // API expected to return token and user
    setToken(res.access_token || res.token || null);
    setUser(res.user || null);
  }

  async function signUp(name: string, email: string, password: string) {
    const res = await apiRegister({ name, email, password, password_confirmation: password });
    setToken(res.access_token || res.token || null);
    setUser(res.user || null);
  }

  function signOut() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
