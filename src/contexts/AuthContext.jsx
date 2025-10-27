
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('lwdf-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('lwdf-user');
    }
  }, []);

  const login = (email, password) => {
    // Mock authentication logic with roles
    let loggedInUser = null;
    if (email.toLowerCase() === 'lwdigitalforge@gmail.com' && password === 'LW_Digital_Forge/123') {
      loggedInUser = { email, role: 'ADMIN' };
    } else if (email && password) {
      // For any other successful login, assign 'USER' role
      loggedInUser = { email, role: 'USER' };
    }

    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('lwdf-user', JSON.stringify(loggedInUser));
      const toastTitle = loggedInUser.role === 'ADMIN' ? "Bem-vindo, Admin!" : "Login realizado com sucesso!";
      toast({ title: toastTitle, description: "Você está sendo redirecionado." });
      return { success: true, user: loggedInUser };
    }
    
    toast({ variant: "destructive", title: "Falha no login", description: "Credenciais inválidas." });
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lwdf-user');
    toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso." });
    navigate('/login');
  };

  const value = { user, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
