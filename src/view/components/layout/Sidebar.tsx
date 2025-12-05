import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  Mail,
  PlusCircle,
  List,
  LogOut,
  Menu,
  X
} from "lucide-react";

import { cn } from "@/infrastructure/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { useSidebarViewModel } from "@/viewmodel/sidebar/useSidebarViewModel";

const iconMap = {
  LayoutDashboard,
  Mail,
  PlusCircle,
  List
};

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const vm = useSidebarViewModel();

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 right-4 z-50 lg:hidden rounded-full border shadow-sm",
          mobileOpen ? "bg-muted" : "bg-card"
        )}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform z-40",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: "var(--gradient-sidebar)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Mail className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>

            <div>
              <h1 className="font-bold text-lg">MailGestor</h1>
              <p className="text-xs opacity-70">Sistema de E-mails</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {vm.navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="font-semibold">
                {vm.user.initial}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {vm.user.name}
              </p>
              <p className="text-xs opacity-60 truncate">
                {vm.user.email}
              </p>
            </div>
          </div>

          <button
            onClick={vm.signOut}
            className="sidebar-link w-full text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
