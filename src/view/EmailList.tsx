import { PageHeader } from "./components/ui/page-header";
import { EmailFilters } from "./components/emails/EmailFilters";
import { EmailTable } from "./components/emails/EmailTable";
import { useEmailListViewModel } from "@/viewmodel/useEmailListViewModel";

export default function EmailList() {
  const vm = useEmailListViewModel();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Histórico de E-mails"
        description={`${vm.filteredEmails.length} e-mails encontrados`}
      />

      <EmailFilters
        searchTerm={vm.searchTerm}
        onSearchChange={vm.onSearchChange}
        dateFilter={vm.dateFilter}
        onDateChange={vm.onDateChange}
      />

      <EmailTable
        emails={vm.emails}
        isLoading={vm.isLoading}
        currentPage={vm.currentPage}
        totalPages={vm.totalPages}
        onPageChange={vm.onPageChange}
      />
    </div>
  );
}
