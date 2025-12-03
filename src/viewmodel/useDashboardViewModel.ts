import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/model/services";

export function useDashboardViewModel() {
  // ========== QUERIES ==========
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: EmailService.getStats,
  });

  const { data: emailsByState = [] } = useQuery({
    queryKey: ["emails-by-state"],
    queryFn: EmailService.getEmailsByState,
  });

  const { data: topDestinatarios = [] } = useQuery({
    queryKey: ["top-destinatarios"],
    queryFn: EmailService.getTopDestinatarios,
  });

  const { data: trendData = [] } = useQuery({
    queryKey: ["trend-data"],
    queryFn: EmailService.getTrend,
  });

  // ========== ESTADOS DERIVADOS ==========
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return {
    // Dados
    stats,
    statsLoading,
    emailsByState,
    topDestinatarios,
    trendData,
    today,
  };
}
