import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/model/services";

import { useEmailFilters } from "@/viewmodel/email/useEmailFilters";
import { useUpdateManyEmails } from "./useEmailMutations";

import { formatters } from "@/infrastructure/lib/formatters";
import { csvExporter } from "@/infrastructure/lib/csvExporter";
import { Email } from "@/model/entities";

export function usePendingEmailsViewModel() {
  const [emailUpdates, setEmailUpdates] = useState<
    Record<string, { estado: string; municipio: string }>
  >({});

  const {
    data: emails = [],
    isLoading,
  } = useQuery({
    queryKey: ["pending-emails"],
    queryFn: EmailService.getPending,
  });

  const {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredEmails,
  } = useEmailFilters(emails);

  const emailsView = useMemo(() => {
    return filteredEmails.map((email: Email) => {
      const updated = emailUpdates[email.id];

      return {
        id: email.id,
        remetente: email.remetente,
        destinatario: email.destinatario,
        formattedDate: formatters.date(email.data_envio),

        estado: updated?.estado || email.estado || "",
        municipio: updated?.municipio || email.municipio || "",
      };
    });
  }, [filteredEmails, emailUpdates]);

  const saveMutation = useUpdateManyEmails();

  async function handleSave() {
    const updates = Object.entries(emailUpdates)
      .filter(([_, val]) => val.estado && val.municipio)
      .map(([id, val]) => ({ id, estado: val.estado, municipio: val.municipio }));

    await saveMutation.mutateAsync(updates);
    setEmailUpdates({});
  }

  function handleLocationChange(emailId: string, field: "estado" | "municipio", value: string) {
    setEmailUpdates(prev => ({
      ...prev,
      [emailId]: {
        ...prev[emailId],
        [field]: value,
        ...(field === "estado" ? { municipio: "" } : {}),
      },
    }));
  }

  function exportCsv() {
  csvExporter.exportCsv(
    emailsView.map(e => ({
      remetente: e.remetente,
      destinatario: e.destinatario,
      data: e.formattedDate,
      estado: e.estado,
      municipio: e.municipio,
    }))
  );
}


  return {
    emailsView,
    isLoading,

    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,

    emailUpdates,
    hasUpdates: Object.keys(emailUpdates).length > 0,

    handleLocationChange,
    handleSave,
    isSaving: saveMutation.isPending,

    exportCsv, // ← agora correto
  };
}