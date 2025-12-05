import { useState, useMemo } from "react";
import { Email } from "@/model/entities";
import { useDeleteEmail } from "./useEmailMutations";
import { formatters } from "@/infrastructure/lib/formatters";

interface Props {
  emails: Email[];
  currentPage: number;
  totalPages: number;
}

export function useEmailTableViewModel({ emails, currentPage, totalPages }: Props) {
  const [emailIdToDelete, setEmailIdToDelete] = useState<string | null>(null);

  const deleteMutation = useDeleteEmail();

  const rows = useMemo(() => {
    return emails.map(email => ({
      id: email.id,
      remetente: email.remetente,
      destinatario: email.destinatario,
      assunto: email.assunto,
      classificado: email.classificado,
      local: formatters.locationShort(email.estado, email.municipio),
      detailsUrl: `/email/${email.id}`
    }));
  }, [emails]);

  function requestDelete(id: string) {
    setEmailIdToDelete(id);
  }

  function cancelDelete() {
    setEmailIdToDelete(null);
  }

  function confirmDelete() {
    if (!emailIdToDelete) return;
    deleteMutation.mutate(emailIdToDelete, {
      onSuccess: () => setEmailIdToDelete(null),
    });
  }

  return {
    rows,
    currentPage,
    totalPages,

    deleteDialogOpen: emailIdToDelete !== null,
    requestDelete,
    cancelDelete,
    confirmDelete,
    deleting: deleteMutation.isPending,
  };
}
