import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
  name: string;
  id: string;
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Important: Start as true

  // Check if user is already logged in
  checkSession: async () => {
    try {
      console.log('Checking session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Session:', session ? 'Found' : 'Not found');
      
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          joinedAt: session.user.created_at,
        };
        console.log('User authenticated:', user.email);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        console.log('No user session found');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Session check error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Sign up new user
  signup: async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: name || data.user.email?.split('@')[0] || 'User',
          joinedAt: data.user.created_at,
        };
        set({ user, isAuthenticated: true });
      }
    } catch (error: any) {
      console.error('Signup error:', error.message);
      throw error;
    }
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          joinedAt: data.user.created_at,
        };
        set({ user, isAuthenticated: true });
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));