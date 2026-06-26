import { createContext, useContext, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    // El token ahora viene en una cookie HttpOnly. 
    // Solo guardamos en LocalStorage la información no sensible del usuario para la UI.
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Le pedimos al backend que borre la cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error durante el logout:', err);
    }
    
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
