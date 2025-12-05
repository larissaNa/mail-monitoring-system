import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { LocationSelect } from "../ui/location-select";
import { Save, X, Loader2 } from "lucide-react";
import { useNewEmailFormViewModel } from "@/viewmodel/email/useNewEmailFormViewModel";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewEmailForm({ onSuccess, onCancel }: Props) {
  const vm = useNewEmailFormViewModel(onSuccess);

  return (
    <Card className="max-w-7xl animate-fade-in">
      <CardContent className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            vm.submit();
          }}
          className="space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="remetente">Remetente</Label>
              <Input
                id="remetente"
                type="email"
                value={vm.form.remetente}
                onChange={(e) => vm.updateField("remetente", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinatario">Destinatário</Label>
              <Input
                id="destinatario"
                type="email"
                value={vm.form.destinatario}
                onChange={(e) => vm.updateField("destinatario", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_envio">Data / Hora</Label>
            <Input
              id="data_envio"
              type="datetime-local"
              value={vm.form.data_envio}
              onChange={(e) => vm.updateField("data_envio", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto</Label>
            <Input
              id="assunto"
              value={vm.form.assunto}
              onChange={(e) => vm.updateField("assunto", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corpo">Corpo da mensagem</Label>
            <Textarea
              id="corpo"
              rows={6}
              value={vm.form.corpo}
              onChange={(e) => vm.updateField("corpo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Localização</Label>
            <LocationSelect
              estado={vm.form.estado}
              municipio={vm.form.municipio}
              onEstadoChange={(v) => vm.updateField("estado", v)}
              onMunicipioChange={(v) => vm.updateField("municipio", v)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={vm.isSaving}>
              {vm.isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>

            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
