import { useAuth } from "@/viewmodel/auth/useAuth";

export function useMainLayoutViewModel() {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;

  return {
    loading,
    isAuthenticated,
  };
}
