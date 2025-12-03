import { useState } from "react";
import { useAuth } from "@/viewmodel/auth/useAuth";

export function useAuthViewModel() {
  const { user } = useAuth();
  const [showReset, setShowReset] = useState(false);

  function openResetPassword() {
    setShowReset(true);
  }

  function closeResetPassword() {
    setShowReset(false);
  }

  const isAuthenticated = !!user;

  return {
    // Estados
    isAuthenticated,
    showReset,

    // Actions
    openResetPassword,
    closeResetPassword,
  };
}
