import { Email } from '@/model/entities';

interface ExportRow {
  remetente: string;
  destinatario: string;
  data: string;
  estado: string;
  municipio: string;
}

export const csvExporter = {
  export: (emails: Email[], getLocation: (email: Email) => { estado: string; municipio: string }): void => {
    const headers = ['Remetente', 'Destinatário', 'Data', 'Estado', 'Município'];
    const rows = emails.map(email => {
      const loc = getLocation(email);
      return [
        email.remetente,
        email.destinatario,
        new Date(email.data_envio).toLocaleDateString('pt-BR'),
        loc.estado,
        loc.municipio
      ];
    });
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails_pendentes.csv';
    a.click();
    URL.revokeObjectURL(url);
  },
};

