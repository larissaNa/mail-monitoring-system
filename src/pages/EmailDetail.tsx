import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { emailService } from '@/services/emailService';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { LocationSelect } from '@/components/ui/location-select';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Loader2,
  Mail
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { EmailDetailView } from '@/components/emails/EmailDetailView';
import { useUpdateEmail } from '@/hooks/useEmailMutations';

export default function EmailDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState('');
  const [editMunicipio, setEditMunicipio] = useState('');

  const { data: email, isLoading, error } = useQuery({
    queryKey: ['email', id],
    queryFn: () => emailService.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useUpdateEmail();

  const openEditDialog = () => {
    setEditState(email?.estado || '');
    setEditMunicipio(email?.municipio || '');
    setEditOpen(true);
  };

  const handleSave = async () => {
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Mail className="h-12 w-12 mb-4 opacity-50" />
        <p>E-mail não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/lista')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Detalhes do E-mail">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </PageHeader>

      <EmailDetailView
        email={email}
        onEdit={openEditDialog}
        onBack={() => navigate(-1)}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Localização</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <LocationSelect
              estado={editState}
              municipio={editMunicipio}
              onEstadoChange={(val) => {
                setEditState(val);
                setEditMunicipio('');
              }}
              onMunicipioChange={setEditMunicipio}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
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
