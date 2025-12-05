import { Toaster } from "../src/view/components/ui/toaster";
import { Toaster as Sonner } from "../src/view/components/ui/sonner";
import { TooltipProvider } from "../src/view/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/infrastructure/auth/authProvider";
import { MainLayout } from "../src/view/components/layout/MainLayout";

import Auth from "@/view/Auth";
import Dashboard from "@/view/Dashboard";
import PendingEmails from "@/view/PendingEmails";
import NewEmail from "@/view/NewEmail";
import EmailList from "@/view/EmailList";
import EmailDetail from "@/view/EmailDetail";
import NotFound from "@/view/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pendentes" element={<PendingEmails />} />
              <Route path="/novo" element={<NewEmail />} />
              <Route path="/lista" element={<EmailList />} />
              <Route path="/emails/:id" element={<EmailDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
