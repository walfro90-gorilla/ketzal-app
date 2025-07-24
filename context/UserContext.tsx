"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define the shape of the user data
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of the context data
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession?.() || {};

  // Sincroniza con localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sincroniza con NextAuth session si existe
  useEffect(() => {
    if (session?.user) {
      const userData = {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
