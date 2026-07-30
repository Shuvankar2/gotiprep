import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: Array<User & { passwordHash: string }>;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

// Simple hash function (NOT for production - this is pre-MongoDB demo only)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],

      login: (email: string, password: string) => {
        const users = get().registeredUsers;
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === simpleHash(password)
        );
        if (found) {
          const { passwordHash: _, ...user } = found;
          set({ user, isAuthenticated: true });
          return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid email or password' };
      },

      register: (name: string, email: string, password: string) => {
        const users = get().registeredUsers;
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: 'An account with this email already exists' };
        }
        const newUser = {
          id: `u_${Date.now()}`,
          email,
          name,
          createdAt: new Date().toISOString(),
          passwordHash: simpleHash(password),
        };
        set({
          registeredUsers: [...users, newUser],
          user: { id: newUser.id, email: newUser.email, name: newUser.name, createdAt: newUser.createdAt },
          isAuthenticated: true,
        });
        return { success: true, message: 'Account created successfully' };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'gotiprep-auth' }
  )
);
