import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, FileText, MapPin, ArrowLeft, Pencil } from 'lucide-react';
import { Email } from '@/types';
import { formatters } from '@/lib/formatters';

interface EmailDetailViewProps {
  email: Email;
  onEdit: () => void;
  onBack: () => void;
}

export function EmailDetailView({ email, onEdit, onBack }: EmailDetailViewProps) {
  return (
    <Card className="max-w-3xl animate-fade-in">
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary-light">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remetente</p>
              <p className="font-medium">{email.remetente}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-light">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destinatário</p>
              <p className="font-medium">{email.destinatario}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-info-light">
              <Calendar className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">
                {formatters.dateTime(email.data_envio)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-success-light">
              <MapPin className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Localização</p>
              <p className="font-medium">
                {formatters.location(email.estado, email.municipio)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-warning-light">
            <FileText className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Assunto</p>
            <p className="font-semibold text-lg">{email.assunto}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">Mensagem</p>
          <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
            {email.corpo || 'Sem conteúdo'}
          </div>
        </div>

        <div className="border-t pt-6 flex gap-3">
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar Local
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

