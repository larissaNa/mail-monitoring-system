export interface Email {
  id: string;
  remetente: string;
  destinatario: string;
  assunto: string;
  corpo: string | null;
  data_envio: string;
  estado: string | null;
  municipio: string | null;
  classificado: boolean;
  colaborador_id: string | null;
  created_at: string;
  updated_at: string;
}
