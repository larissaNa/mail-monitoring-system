import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { EmailService } from "@/model/services";
import { useUpdateEmail } from "./useEmailMutations";
import { formatters } from "@/infrastructure/lib/formatters";

export function useEmailDetailViewModel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: email,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["email", id],
    queryFn: () => EmailService.getById(id!),
    enabled: !!id,
  });

  const formatted = useMemo(() => {
    if (!email) return null;

    return {
      remetente: email.remetente,
      destinatario: email.destinatario,
      dataEnvio: formatters.dateTime(email.data_envio),
      local: formatters.location(email.estado, email.municipio),
      assunto: email.assunto,
      corpo: email.corpo || "Sem conteúdo",
    };
  }, [email]);

  //States
  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState("");
  const [editMunicipio, setEditMunicipio] = useState("");

  const updateMutation = useUpdateEmail();

  // Actions
  function openEditDialog() {
    if (!email) return;
    setEditState(email.estado || "");
    setEditMunicipio(email.municipio || "");
    setEditOpen(true);
  }

  async function handleSave() {
    if (!email) return;

    await updateMutation.mutateAsync({
      id: email.id,
      updates: {
        estado: editState,
        municipio: editMunicipio,
        classificado: !!(editState && editMunicipio),
      },
    });

    setEditOpen(false);
  }

  function handleCancelEdit() {
    setEditOpen(false);
  }

  function goBack() {
    navigate(-1);
  }

  function goToList() {
    navigate("/lista");
  }

  return {
    // Data
    email,
    formatted,
    isLoading,
    error,

    // Edit State
    editOpen,
    editState,
    editMunicipio,

    // Actions
    openEditDialog,
    handleSave,
    handleCancelEdit,
    setEditState,
    setEditMunicipio,

    // Navigation
    goBack,
    goToList,

    // Indicators
    isSaving: updateMutation.isPending,
  };
}
