import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { NewEmailForm } from '@/components/emails/NewEmailForm';

export default function NewEmail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Novo E-mail Manual" 
        description="Preencha os dados do envio"
      />

      <NewEmailForm
        onSuccess={() => navigate('/lista')}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
