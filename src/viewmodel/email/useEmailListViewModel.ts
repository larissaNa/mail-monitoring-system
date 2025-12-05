import { useEffect, useState, useMemo } from "react";
import { Email } from "@/model/entities";
import { EmailService } from "@/model/services/EmailService";
import { formatters } from "@/infrastructure/lib/formatters";

export function useEmailListViewModel() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // deleção
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // carregar emails
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await EmailService.getAll();
      setEmails(data);
      setIsLoading(false);
    }
    load();
  }, []);

  // filtros aplicados
  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch =
        email.remetente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.assunto.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        !dateFilter || email.data_envio.startsWith(dateFilter);

      return matchesSearch && matchesDate;
    });
  }, [emails, searchTerm, dateFilter]);

  // paginação
  const totalPages = Math.max(1, Math.ceil(filteredEmails.length / pageSize));
  const emailsPaginated = filteredEmails.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // tabela formatada (rows)
  const rows = emailsPaginated.map(email => ({
    id: email.id,
    remetente: email.remetente,
    destinatario: email.destinatario,
    assunto: email.assunto,
    classificado: email.classificado,
    local: formatters.location(email.estado, email.municipio),
    detailsUrl: `/emails/${email.id}`
  }));

  // ações de filtro
  function onSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function onDateChange(value: string) {
    setDateFilter(value);
    setCurrentPage(1);
  }

  // ações da tabela
  function onPageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  // deleção
  function onRequestDelete(id: string) {
    setEmailToDelete(id);
    setDeleteDialogOpen(true);
  }

  function onCancelDelete() {
    setEmailToDelete(null);
    setDeleteDialogOpen(false);
  }

  async function onConfirmDelete() {
    if (!emailToDelete) return;

    setDeleting(true);
    await EmailService.delete(emailToDelete);

    setEmails(prev => prev.filter(e => e.id !== emailToDelete));

    setDeleting(false);
    setDeleteDialogOpen(false);
    setEmailToDelete(null);
  }

  return {
    emails,
    filteredEmails,
    isLoading,

    // filtros
    searchTerm,
    dateFilter,
    onSearchChange,
    onDateChange,

    // paginação
    currentPage,
    totalPages,
    onPageChange,

    // rows para tabela
    rows,

    // deleção
    onRequestDelete,
    onCancelDelete,
    onConfirmDelete,
    deleteDialogOpen,
    deleting,
  };
}
