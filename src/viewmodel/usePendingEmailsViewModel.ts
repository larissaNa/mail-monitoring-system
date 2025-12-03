import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/model/services";
import { useEmailFilters } from "@/viewmodel/email/useEmailFilters";
import { useUpdateManyEmails } from "./email/useEmailMutations";
import { csvExporter } from "@/infrastructure/lib/csvExporter";
import { Email } from "@/model/entities";

export function usePendingEmailsViewModel() {
  // Atualizações de estado/municipio
  const [emailUpdates, setEmailUpdates] = useState<
    Record<string, { estado: string; municipio: string }>
  >({});

  // Busca dos e-mails pendentes
  const {
    data: emails = [],
    isLoading,
  } = useQuery({
    queryKey: ["pending-emails"],
    queryFn: EmailService.getPending,
  });

  // Filtros (já funcionando como ViewModel auxiliar)
  const {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    filteredEmails,
  } = useEmailFilters(emails);

  // Mutação de salvar vários emails
  const saveMutation = useUpdateManyEmails();

  // ==========================
  // ACTIONS DO VIEWMODEL
  // ==========================

  function handleLocationChange(
    emailId: string,
    field: "estado" | "municipio",
    value: string
  ) {
    setEmailUpdates((prev) => ({
      ...prev,
      [emailId]: {
        ...prev[emailId],
        [field]: value,
        ...(field === "estado" ? { municipio: "" } : {}),
      },
    }));
  }

  function getEmailLocation(email: Email) {
    const update = emailUpdates[email.id];
    return {
      estado: update?.estado || email.estado || "",
      municipio: update?.municipio || email.municipio || "",
    };
  }

  async function handleSave() {
    const updates = Object.entries(emailUpdates)
      .filter(([_, val]) => val.estado && val.municipio)
      .map(([id, val]) => ({ id, ...val }));

    await saveMutation.mutateAsync(updates);
    setEmailUpdates({});
  }

  function handleExport() {
    csvExporter.export(filteredEmails, getEmailLocation);
  }

  const hasUpdates = Object.keys(emailUpdates).length > 0;

  // ==========================
  // ESTADO + ACTIONS DA VIEWMODEL
  // ==========================

  return {
    // estado
    emails: filteredEmails,
    isLoading,
    searchTerm,
    dateFilter,
    emailUpdates,
    hasUpdates,

    // actions
    setSearchTerm,
    setDateFilter,
    handleSave,
    handleExport,
    handleLocationChange,
    getEmailLocation,
    isSaving: saveMutation.isPending,
  };
}
