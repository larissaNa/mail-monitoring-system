import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailService } from '@/services/emailService';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Save, Download, Loader2 } from 'lucide-react';
import { Email } from '@/types';
import { EmailFilters } from '@/components/emails/EmailFilters';
import { PendingEmailsTable } from '@/components/emails/PendingEmailsTable';
import { useEmailFilters } from '@/hooks/useEmailFilters';
import { useUpdateManyEmails } from '@/hooks/useEmailMutations';
import { csvExporter } from '@/lib/csvExporter';

export default function PendingEmails() {
  const [emailUpdates, setEmailUpdates] = useState<Record<string, { estado: string; municipio: string }>>({});

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['pending-emails'],
    queryFn: emailService.getPending,
  });

  const { searchTerm, setSearchTerm, dateFilter, setDateFilter, filteredEmails } = useEmailFilters(emails);
  const saveMutation = useUpdateManyEmails();

  const handleLocationChange = (emailId: string, field: 'estado' | 'municipio', value: string) => {
    setEmailUpdates(prev => ({
      ...prev,
      [emailId]: {
        ...prev[emailId],
        [field]: value,
        ...(field === 'estado' ? { municipio: '' } : {})
      }
    }));
  };

  const getEmailLocation = (email: Email) => {
    const update = emailUpdates[email.id];
    return {
      estado: update?.estado || email.estado || '',
      municipio: update?.municipio || email.municipio || ''
    };
  };

  const handleSave = async () => {
    const updates = Object.entries(emailUpdates)
      .filter(([_, val]) => val.estado && val.municipio)
      .map(([id, val]) => ({ id, ...val }));
    
    await saveMutation.mutateAsync(updates);
    setEmailUpdates({});
  };

  const handleExport = () => {
    csvExporter.export(filteredEmails, getEmailLocation);
  };

  const hasUpdates = Object.keys(emailUpdates).length > 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="E-mails Pendentes" 
        description="Lista de e-mails aguardando classificação"
      >
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={filteredEmails.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!hasUpdates || saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Tudo
        </Button>
      </PageHeader>

      <EmailFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      <PendingEmailsTable
        emails={filteredEmails}
        isLoading={isLoading}
        emailUpdates={emailUpdates}
        onLocationChange={handleLocationChange}
        getEmailLocation={getEmailLocation}
      />
    </div>
  );
}
