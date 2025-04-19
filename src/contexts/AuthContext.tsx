
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers: User[] = [
  { id: '1', email: 'demo@example.com', name: 'Demo User' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success('Logged in successfully');
      } else {
        // For demo, let's create a new user if they don't exist
        const newUser = { id: `${Date.now()}`, email, name: email.split('@')[0] };
        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success('Account created and logged in');
      }
    } catch (error) {
      toast.error('Failed to login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        toast.error('User already exists');
        return;
      }
      
      const newUser = { id: `${Date.now()}`, email, name };
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Failed to register');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
