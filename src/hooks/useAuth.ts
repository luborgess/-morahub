import { create } from 'zustand';
import { AuthService } from '../services/auth.service';
import type { Profile } from '../lib/supabase';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });
      const user = await AuthService.getCurrentUser();
      set({ user, initialized: true });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const user = await AuthService.signIn(email, password);
      set({ user });
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      set({ loading: true });
      const user = await AuthService.signUp(email, password, userData);
      set({ user });
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await AuthService.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
