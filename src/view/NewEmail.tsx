import { PageHeader } from "./components/ui/page-header";
import { NewEmailForm } from "./components/emails/NewEmailForm";
import { useNewEmailViewModel } from "@/viewmodel/email/useNewEmailViewModel";

export default function NewEmail() {
  const vm = useNewEmailViewModel();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo E-mail Manual"
        description="Preencha os dados do envio"
      />

      <NewEmailForm
        onSuccess={vm.handleSuccess}
        onCancel={vm.handleCancel}
      />
    </div>
  );
}
