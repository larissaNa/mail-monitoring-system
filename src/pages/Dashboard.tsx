import { useQuery } from '@tanstack/react-query';
import { emailService } from '@/services/emailService';
import { PageHeader } from '@/components/ui/page-header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { TopDestinatariosCard } from '@/components/dashboard/TopDestinatariosCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: emailService.getStats,
  });

  const { data: emailsByState = [] } = useQuery({
    queryKey: ['emails-by-state'],
    queryFn: emailService.getEmailsByState,
  });

  const { data: topDestinatarios = [] } = useQuery({
    queryKey: ['top-destinatarios'],
    queryFn: emailService.getTopDestinatarios,
  });

  const { data: trendData = [] } = useQuery({
    queryKey: ['trend-data'],
    queryFn: emailService.getTrend,
  });

  const today = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description={`Resumo geral - ${today}`}
      />

      <StatsCards stats={stats} isLoading={statsLoading} />

      <ChartsSection emailsByState={emailsByState} trendData={trendData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopDestinatariosCard topDestinatarios={topDestinatarios} />
        <QuickActionsCard />
      </div>
    </div>
  );
}
