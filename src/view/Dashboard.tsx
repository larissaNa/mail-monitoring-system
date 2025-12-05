import { PageHeader } from "./components/ui/page-header";
import { StatsCards } from "./components/dashboard/StatsCards";
import { ChartsSection } from "./components/dashboard/ChartsSection";
import { TopDestinatariosCard } from "./components/dashboard/TopDestinatariosCard";
import { QuickActionsCard } from "./components/dashboard/QuickActionsCard";

import { useDashboardViewModel } from "@/viewmodel/dashboard/useDashboardViewModel";

export default function Dashboard() {
  const vm = useDashboardViewModel();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard"
        description={`Resumo geral - ${vm.today}`}
      />

      <StatsCards stats={vm.stats} isLoading={vm.statsLoading} />

      <ChartsSection 
        emailsByState={vm.emailsByState}
        trendData={vm.trendData}
      />

      <div className="grid gap-6 lg:grid-cols-2 w-full">
        <TopDestinatariosCard topDestinatarios={vm.topDestinatarios} />
        <QuickActionsCard />
      </div>
    </div>
  );
}
