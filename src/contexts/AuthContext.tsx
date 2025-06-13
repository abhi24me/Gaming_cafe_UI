
'use client';

import type { AuthState } from '@/lib/types';
import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthState | undefined>(undefined);

const GAMER_TAG_KEY = 'welloGamerTag';
const IS_AUTHENTICATED_KEY = 'welloIsAuthenticated';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [gamerTag, setGamerTag] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); // To prevent flash of unauthenticated content
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedGamerTag = localStorage.getItem(GAMER_TAG_KEY);
      const storedIsAuthenticated = localStorage.getItem(IS_AUTHENTICATED_KEY);

      if (storedGamerTag && storedIsAuthenticated === 'true') {
        setGamerTag(storedGamerTag);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Handle environments where localStorage is not available or blocked
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    try {
      if (!isLoading) { // Only save after initial load to prevent overwriting
        if (isAuthenticated && gamerTag) {
          localStorage.setItem(GAMER_TAG_KEY, gamerTag);
          localStorage.setItem(IS_AUTHENTICATED_KEY, 'true');
        } else {
          localStorage.removeItem(GAMER_TAG_KEY);
          localStorage.removeItem(IS_AUTHENTICATED_KEY);
        }
      }
    } catch (error) {
        console.error("Failed to access localStorage for saving:", error);
    }
  }, [gamerTag, isAuthenticated, isLoading]);

  const login = (tag: string) => {
    if (tag.trim()) {
      const trimmedTag = tag.trim();
      setGamerTag(trimmedTag);
      setIsAuthenticated(true);
      router.push('/');
      toast({
        title: "Login Successful",
        description: `Welcome back, ${trimmedTag}!`,
        className: "bg-green-600 text-white border-green-700",
      });
    }
  };

  const logout = () => {
    const currentTag = gamerTag;
    setGamerTag(null);
    setIsAuthenticated(false);
    router.push('/login');
    toast({
        title: "Logged Out",
        description: `See you soon, ${currentTag || 'Gamer'}!`,
      });
  };

  const updateGamerTag = (newTag: string) => {
    if (newTag.trim() && isAuthenticated) {
      const oldTag = gamerTag;
      const trimmedNewTag = newTag.trim();
      setGamerTag(trimmedNewTag);
      toast({
        title: "Gamer Tag Updated!",
        description: `Your Gamer Tag has been changed from ${oldTag} to ${trimmedNewTag}.`,
        className: "bg-primary text-primary-foreground border-primary",
      });
    } else if (!newTag.trim()) {
        toast({
            title: "Invalid Gamer Tag",
            description: "Gamer Tag cannot be empty.",
            variant: "destructive",
        });
    }
  };

  const value = { gamerTag, isAuthenticated, login, logout, updateGamerTag };

  if (isLoading) {
    // You can render a loading spinner or null here if you want to avoid layout shifts
    return null; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
