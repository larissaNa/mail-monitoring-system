import { useState, useMemo } from 'react';
import { Email } from '@/model/entities';

export function useEmailFilters(emails: Email[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch = !searchTerm || 
        email.remetente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.assunto.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || 
        email.data_envio.startsWith(dateFilter);
      
      return matchesSearch && matchesDate;
    });
  }, [emails, searchTerm, dateFilter]);

  return {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredEmails,
  };
}

