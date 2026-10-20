import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, isDemoMode } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('launchpad_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('launchpad_token')) && !isDemoMode);

  useEffect(() => {
    const token = localStorage.getItem('launchpad_token');
    if (!token || isDemoMode) return;
    api.get('/api/auth/me')
      .then(({ data }) => setUser(data.user || data))
      .catch(() => {
        localStorage.removeItem('launchpad_token');
        localStorage.removeItem('launchpad_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    if (isDemoMode) {
      if (!email || !password) throw new Error('Enter your email and password.');
      const name = email.split('@')[0].split(/[._-]/).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');
      const demoUser = { name: name || 'Demo Candidate', email };
      localStorage.setItem('launchpad_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    const { data } = await api.post('/api/auth/login', { email, password });
    const token = data.token || data.accessToken || data.data?.token;
    const authenticatedUser = data.user || data.data?.user;
    if (!token || !authenticatedUser) throw new Error('The login API response is missing the user or token.');
    localStorage.setItem('launchpad_token', token);
    localStorage.setItem('launchpad_user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function register(formData) {
    if (isDemoMode) {
      const demoUser = { name: formData.name, email: formData.email };
      localStorage.setItem('launchpad_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    const { data } = await api.post('/api/auth/register', formData);
    const token = data.token || data.accessToken || data.data?.token;
    const registeredUser = data.user || data.data?.user;
    if (token) localStorage.setItem('launchpad_token', token);
    if (registeredUser) {
      localStorage.setItem('launchpad_user', JSON.stringify(registeredUser));
      setUser(registeredUser);
    }
    return registeredUser;
  }

  function logout() {
    localStorage.removeItem('launchpad_token');
    localStorage.removeItem('launchpad_user');
    setUser(null);
  }

  function updateUser(updatedUser) {
    localStorage.setItem('launchpad_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, updateUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
