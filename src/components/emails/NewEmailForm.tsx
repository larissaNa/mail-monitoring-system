import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LocationSelect } from '@/components/ui/location-select';
import { Save, X, Loader2 } from 'lucide-react';
import { useCreateEmail } from '@/hooks/useEmailMutations';
import { useAuth } from '@/hooks/useAuth';
import { emailSchema, type EmailFormData } from '@/lib/validationSchemas';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface NewEmailFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewEmailForm({ onSuccess, onCancel }: NewEmailFormProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const createMutation = useCreateEmail();

  const [formData, setFormData] = useState<EmailFormData>({
    remetente: '',
    destinatario: '',
    assunto: '',
    corpo: '',
    data_envio: '',
    estado: '',
    municipio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = emailSchema.parse(formData);
      
      await createMutation.mutateAsync({
        remetente: validated.remetente,
        destinatario: validated.destinatario,
        assunto: validated.assunto,
        corpo: validated.corpo || null,
        data_envio: new Date(validated.data_envio).toISOString(),
        estado: validated.estado,
        municipio: validated.municipio,
        classificado: true,
        colaborador_id: profile?.id || null,
      });
      
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: 'destructive', title: error.errors[0].message });
      }
    }
  };

  return (
    <Card className="max-w-2xl animate-fade-in">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="remetente">Remetente</Label>
              <Input
                id="remetente"
                type="email"
                placeholder="remetente@empresa.com"
                value={formData.remetente}
                onChange={(e) => setFormData({ ...formData, remetente: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinatario">Destinatário</Label>
              <Input
                id="destinatario"
                type="email"
                placeholder="destinatario@dominio.com"
                value={formData.destinatario}
                onChange={(e) => setFormData({ ...formData, destinatario: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_envio">Data / Hora</Label>
            <Input
              id="data_envio"
              type="datetime-local"
              value={formData.data_envio}
              onChange={(e) => setFormData({ ...formData, data_envio: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto</Label>
            <Input
              id="assunto"
              placeholder="Assunto do e-mail"
              value={formData.assunto}
              onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corpo">Corpo da mensagem</Label>
            <Textarea
              id="corpo"
              placeholder="Digite o conteúdo do e-mail..."
              rows={6}
              value={formData.corpo}
              onChange={(e) => setFormData({ ...formData, corpo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Localização</Label>
            <LocationSelect
              estado={formData.estado}
              municipio={formData.municipio}
              onEstadoChange={(val) => setFormData({ ...formData, estado: val, municipio: '' })}
              onMunicipioChange={(val) => setFormData({ ...formData, municipio: val })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
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

