export const formatters = {
  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  },

  dateTime: (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  },

  dateForInput: (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },

  chartDate: (dateString: string): string => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const month = parseInt(parts[1], 10);
      return `${day}/${month}`;
    }
    const date = new Date(dateString + 'T00:00:00Z');
    return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
  },

  location: (estado: string | null, municipio: string | null): string => {
    if (estado && municipio) {
      return `${estado} - ${municipio}`;
    }
    if (estado) {
      return estado;
    }
    return 'Não classificado';
  },

  locationShort: (estado: string | null, municipio: string | null): string => {
    if (estado && municipio) {
      return `${estado} / ${municipio}`;
    }
    return '-';
  },

  datetimeLocalToISO: (datetimeLocal: string): string => {
    const [datePart, timePart] = datetimeLocal.split('T');
    const [hours, minutes] = (timePart || '00:00').split(':');
    
    return `${datePart}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00.000Z`;
  },
};

