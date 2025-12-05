import { useState } from "react";
import { useCreateEmail } from "./useEmailMutations";
import { EmailFormData, emailSchema } from "@/infrastructure/lib/validationSchemas";
import { z } from "zod";
import { useAuth } from "@/viewmodel/auth/useAuth";
import { useToast } from "@/view/components/ui/hooks/use-toast";
import { formatters } from "@/infrastructure/lib/formatters";

export function useNewEmailFormViewModel(onSuccess: () => void) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const createMutation = useCreateEmail();

  const [form, setForm] = useState<EmailFormData>({
    remetente: "",
    destinatario: "",
    assunto: "",
    corpo: "",
    data_envio: "",
    estado: "",
    municipio: "",
  });

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function submit() {
    try {
      const validated = emailSchema.parse(form);

      await createMutation.mutateAsync({
        remetente: validated.remetente,
        destinatario: validated.destinatario,
        assunto: validated.assunto,
        corpo: validated.corpo || null,
        data_envio: formatters.datetimeLocalToISO(validated.data_envio),
        estado: validated.estado,
        municipio: validated.municipio,
        classificado: true,
        colaborador_id: profile?.id || null,
      });

      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: "destructive", title: error.errors[0].message });
      }
    }
  }

  return {
    form,
    updateField,
    submit,
    isSaving: createMutation.isPending,
  };
}
