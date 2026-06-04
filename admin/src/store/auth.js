import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  user: null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null, user: null });
  }
}));
