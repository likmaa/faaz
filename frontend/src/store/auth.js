import { create } from 'zustand';

export const useAuthStore = create(set => ({
  token: localStorage.getItem('auth_token'),
  setToken: (t) => {
    if (t) localStorage.setItem('auth_token', t); else localStorage.removeItem('auth_token');
    set({ token: t });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ token: null });
  }
}));
