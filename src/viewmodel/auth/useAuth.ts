import { useAuthProvider } from "@/infrastructure/auth/authProvider";

export function useAuth() {
  return useAuthProvider();
}
