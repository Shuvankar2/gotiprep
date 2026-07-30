import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { passages as seedPassages } from '../data/passages';
import type { Passage } from '../data/passages';
import { sentenceItems as seedSentences } from '../data/sentences';
import type { SentenceItem } from '../data/sentences';
import { emailPrompts as seedEmails } from '../data/emailPrompts';
import type { EmailPrompt } from '../data/emailPrompts';
import { typingPassages as seedTypingPassages } from '../data/typingPassages';
import type { TypingPassage } from '../data/typingPassages';

// Seeded admin credentials (pre-MongoDB)
export const ADMIN_CREDENTIALS = {
  email: 'admin@gotiprep.com',
  password: 'GotiPrep@123',
  name: 'Super Admin',
  role: 'superadmin' as const,
};

interface AdminState {
  isAdminAuthenticated: boolean;
  passages: Passage[];
  sentences: SentenceItem[];
  emailPrompts: EmailPrompt[];
  typingPassages: TypingPassage[];

  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  adminLogout: () => void;

  // Passage CRUD
  addPassage: (p: Omit<Passage, 'id'>) => void;
  updatePassage: (id: string, p: Partial<Passage>) => void;
  deletePassage: (id: string) => void;

  // Sentence CRUD
  addSentence: (s: Omit<SentenceItem, 'id'>) => void;
  updateSentence: (id: string, s: Partial<SentenceItem>) => void;
  deleteSentence: (id: string) => void;

  // Email Prompt CRUD
  addEmailPrompt: (e: Omit<EmailPrompt, 'id'>) => void;
  updateEmailPrompt: (id: string, e: Partial<EmailPrompt>) => void;
  deleteEmailPrompt: (id: string) => void;

  // Typing Passage CRUD
  addTypingPassage: (p: Omit<TypingPassage, 'id'>) => void;
  updateTypingPassage: (id: string, p: Partial<TypingPassage>) => void;
  deleteTypingPassage: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      passages: seedPassages,
      sentences: seedSentences,
      emailPrompts: seedEmails,
      typingPassages: seedTypingPassages,

      adminLogin: (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ isAdminAuthenticated: true });
          return { success: true, message: 'Admin login successful' };
        }
        return { success: false, message: 'Invalid admin credentials' };
      },

      adminLogout: () => set({ isAdminAuthenticated: false }),

      addPassage: (p) => set({ passages: [...get().passages, { ...p, id: `p_${Date.now()}` }] }),
      updatePassage: (id, p) => set({ passages: get().passages.map((x) => (x.id === id ? { ...x, ...p } : x)) }),
      deletePassage: (id) => set({ passages: get().passages.filter((x) => x.id !== id) }),

      addSentence: (s) => set({ sentences: [...get().sentences, { ...s, id: `s_${Date.now()}` }] }),
      updateSentence: (id, s) => set({ sentences: get().sentences.map((x) => (x.id === id ? { ...x, ...s } : x)) }),
      deleteSentence: (id) => set({ sentences: get().sentences.filter((x) => x.id !== id) }),

      addEmailPrompt: (e) => set({ emailPrompts: [...get().emailPrompts, { ...e, id: `e_${Date.now()}` }] }),
      updateEmailPrompt: (id, e) => set({ emailPrompts: get().emailPrompts.map((x) => (x.id === id ? { ...x, ...e } : x)) }),
      deleteEmailPrompt: (id) => set({ emailPrompts: get().emailPrompts.filter((x) => x.id !== id) }),

      addTypingPassage: (p) => set({ typingPassages: [...get().typingPassages, { ...p, id: `t_${Date.now()}` }] }),
      updateTypingPassage: (id, p) => set({ typingPassages: get().typingPassages.map((x) => (x.id === id ? { ...x, ...p } : x)) }),
      deleteTypingPassage: (id) => set({ typingPassages: get().typingPassages.filter((x) => x.id !== id) }),
    }),
    { name: 'gotiprep-admin' }
  )
);
