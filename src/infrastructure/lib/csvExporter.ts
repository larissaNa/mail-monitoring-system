interface ExportRow {
  remetente: string;
  destinatario: string;
  data: string;
  estado: string;
  municipio: string;
}

export const csvExporter = {
  exportCsv: (emails: ExportRow[]): void => {
    const headers = ['Remetente', 'Destinatário', 'Data', 'Estado', 'Município'];

    const rows = emails.map(email => [
      email.remetente,
      email.destinatario,
      email.data,
      email.estado,
      email.municipio
    ]);

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
