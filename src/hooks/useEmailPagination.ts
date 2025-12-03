import { useState, useMemo } from 'react';
import { Email } from '@/types';

const ITEMS_PER_PAGE = 10;

export function useEmailPagination(emails: Email[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedEmails = useMemo(() => {
    return emails.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [emails, currentPage]);

  const totalPages = Math.ceil(emails.length / ITEMS_PER_PAGE);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedEmails,
    resetPage,
  };
}

