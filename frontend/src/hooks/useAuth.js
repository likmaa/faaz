import { useAuthStore } from '../store/auth';

export default function useAuth() {
  const { token, setToken, logout } = useAuthStore();
  return { token, setToken, logout, isAuthenticated: !!token };
}
