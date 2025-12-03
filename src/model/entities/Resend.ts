/**
 * Types para o payload do Resend Inbound Email Webhook
 */
export interface ResendInboundPayload {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  date: string;
  headers?: Record<string, string>;
  cc?: string[];
  bcc?: string[];
  reply_to?: string;
  attachments?: ResendAttachment[];
}

export interface ResendAttachment {
  filename: string;
  content_type: string;
  size: number;
  content_id?: string;
}

/**
 * Tipo para dados de e-mail prontos para inserção no banco
 */
export interface InboundEmailData {
  remetente: string;
  destinatario: string;
  assunto: string;
  corpo: string | null;
  data_envio: string;
  estado: string | null;
  municipio: string | null;
  classificado: boolean;
}
