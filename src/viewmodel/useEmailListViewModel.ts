import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/model/services";
import { useEmailFilters } from "@/viewmodel/email/useEmailFilters";
import { useEmailPagination } from "@/viewmodel/email/useEmailPagination";

export function useEmailListViewModel() {
  // 1. Busca de dados
  const {
    data: emails = [],
    isLoading,
  } = useQuery({
    queryKey: ["emails"],
    queryFn: EmailService.getAll,
  });

  // 2. Filtros
  const {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredEmails,
  } = useEmailFilters(emails);

  // 3. Paginação
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedEmails,
    resetPage,
  } = useEmailPagination(filteredEmails);

  // 4. Actions para a View
  function handleSearchChange(value: string) {
    setSearchTerm(value);
    resetPage();
  }

  function handleDateChange(value: string) {
    setDateFilter(value);
    resetPage();
  }

  return {
    // Dados renderizados na View
    emails: paginatedEmails,
    isLoading,
    filteredEmails,

    // Filtros
    searchTerm,
    dateFilter,

    // Paginação
    currentPage,
    totalPages,

    // Actions
    onSearchChange: handleSearchChange,
    onDateChange: handleDateChange,
    onPageChange: setCurrentPage,
  };
}
