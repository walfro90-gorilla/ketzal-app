"use client"


import React, { createContext, useState, useContext, ReactNode } from 'react';

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
