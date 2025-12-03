import { StatCard } from '@/components/ui/stat-card';
import { Mail, CheckCircle2, Clock } from 'lucide-react';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total de E-mails"
        value={isLoading ? '...' : stats?.total || 0}
        icon={<Mail className="h-6 w-6" />}
        variant="primary"
      />
      <StatCard
        title="Classificados"
        value={isLoading ? '...' : stats?.classificados || 0}
        icon={<CheckCircle2 className="h-6 w-6" />}
        variant="success"
      />
      <StatCard
        title="Pendentes"
        value={isLoading ? '...' : stats?.pendentes || 0}
        icon={<Clock className="h-6 w-6" />}
        variant="warning"
      />
    </div>
  );
}

