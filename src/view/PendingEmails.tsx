import { PageHeader } from "./components/ui/page-header";
import { Button } from "./components/ui/button";
import { Save, Download, Loader2 } from "lucide-react";
import { EmailFilters } from "./components/emails/EmailFilters";
import { PendingEmailsTable } from "./components/emails/PendingEmailsTable";
import { usePendingEmailsViewModel } from "@/viewmodel/usePendingEmailsViewModel";

export default function PendingEmails() {
  const vm = usePendingEmailsViewModel();

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-mails Pendentes"
        description="Lista de e-mails aguardando classificação"
      >
        <Button
          variant="outline"
          onClick={vm.handleExport}
          disabled={vm.emails.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>

        <Button onClick={vm.handleSave} disabled={!vm.hasUpdates || vm.isSaving}>
          {vm.isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Tudo
        </Button>
      </PageHeader>

      <EmailFilters
        searchTerm={vm.searchTerm}
        onSearchChange={vm.setSearchTerm}
        dateFilter={vm.dateFilter}
        onDateChange={vm.setDateFilter}
      />

      <PendingEmailsTable
        emails={vm.emails}
        isLoading={vm.isLoading}
        emailUpdates={vm.emailUpdates}
        onLocationChange={vm.handleLocationChange}
        getEmailLocation={vm.getEmailLocation}
      />
    </div>
  );
}
