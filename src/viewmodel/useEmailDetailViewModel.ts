import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EmailService } from "@/model/services";
import { useUpdateEmail } from "./email/useEmailMutations";

export function useEmailDetailViewModel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ==========================
  // FETCH DO EMAIL
  // ==========================
  const {
    data: email,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["email", id],
    queryFn: () => EmailService.getById(id!),
    enabled: !!id,
  });

  // ==========================
  // STATES DO MODAL DE EDIÇÃO
  // ==========================
  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState("");
  const [editMunicipio, setEditMunicipio] = useState("");

  const updateMutation = useUpdateEmail();

  // ==========================
  // ACTIONS
  // ==========================

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
    // Dados
    email,
    isLoading,
    error,

    // Edit
    editOpen,
    editState,
    editMunicipio,

    // Actions
    openEditDialog,
    handleSave,
    handleCancelEdit,
    setEditState,
    setEditMunicipio,

    // Util
    goBack,
    goToList,
    isSaving: updateMutation.isPending,
  };
}
