import { PageHeader } from "./components/ui/page-header";
import { Button } from "./components/ui/button";
import {
  ArrowLeft,
  Save,
  X,
  Loader2,
  Mail
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";

import { EmailDetailView } from "./components/emails/EmailDetailView";
import { LocationSelect } from "./components/ui/location-select";

import { useEmailDetailViewModel } from "@/viewmodel/email/useEmailDetailViewModel";

export default function EmailDetail() {
  const vm = useEmailDetailViewModel();

  if (vm.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (vm.error || !vm.email) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Mail className="h-12 w-12 mb-4 opacity-50" />
        <p>E-mail não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={vm.goToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Detalhes do E-mail">
        <Button variant="outline" onClick={vm.goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </PageHeader>

      <EmailDetailView
        formatted={vm.formatted!}
        onEdit={vm.openEditDialog}
        onBack={vm.goBack}
      />

      <Dialog open={vm.editOpen} onOpenChange={vm.handleCancelEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Localização</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <LocationSelect
              estado={vm.editState}
              municipio={vm.editMunicipio}
              onEstadoChange={(val) => {
                vm.setEditState(val);
                vm.setEditMunicipio("");
              }}
              onMunicipioChange={vm.setEditMunicipio}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={vm.handleCancelEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <Button onClick={vm.handleSave} disabled={vm.isSaving}>
              {vm.isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
