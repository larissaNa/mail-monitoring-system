import { useQuery } from '@tanstack/react-query';
import { emailService } from '@/services/emailService';
import { PageHeader } from '@/components/ui/page-header';
import { EmailFilters } from '@/components/emails/EmailFilters';
import { EmailTable } from '@/components/emails/EmailTable';
import { useEmailFilters } from '@/hooks/useEmailFilters';
import { useEmailPagination } from '@/hooks/useEmailPagination';

export default function EmailList() {
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: emailService.getAll,
  });

  const { searchTerm, setSearchTerm, dateFilter, setDateFilter, filteredEmails } = useEmailFilters(emails);
  const { currentPage, setCurrentPage, totalPages, paginatedEmails, resetPage } = useEmailPagination(filteredEmails);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    resetPage();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Histórico de E-mails" 
        description={`${filteredEmails.length} e-mails encontrados`}
      />

      <EmailFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        dateFilter={dateFilter}
        onDateChange={handleDateChange}
      />

      <EmailTable
        emails={paginatedEmails}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
