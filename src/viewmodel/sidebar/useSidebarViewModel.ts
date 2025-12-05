import { useAuth } from "@/viewmodel/auth/useAuth";

export function useSidebarViewModel() {
  const { profile, signOut } = useAuth();

  const userInitial = profile?.nome?.charAt(0).toUpperCase() || "U";

  const navItems = [
    { to: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/pendentes", icon: "Mail", label: "E-mails Pendentes" },
    { to: "/novo", icon: "PlusCircle", label: "Cadastro Manual" },
    { to: "/lista", icon: "List", label: "Lista Geral" }
  ];

  return {
    navItems,
    user: {
      name: profile?.nome || "Usuário",
      email: profile?.email || "",
      initial: userInitial,
    },
    signOut
  };
}
