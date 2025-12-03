import { Email, DashboardStats, EmailsByState, TopDestinatario, TrendData, InboundEmailData } from '@/model/entities';
import { EmailRepository } from '@/model/repositories';

export class EmailService {
  static async getAll(): Promise<Email[]> {
    return EmailRepository.getAll();
  }

  static async getPending(): Promise<Email[]> {
    return EmailRepository.getPending();
  }

  static async getById(id: string): Promise<Email | null> {
    return EmailRepository.getById(id);
  }

  static async create(email: Omit<Email, 'id' | 'created_at' | 'updated_at'>): Promise<Email> {
    return EmailRepository.create(email);
  }

  static async update(id: string, updates: Partial<Email>): Promise<Email> {
    return EmailRepository.update(id, updates);
  }

  static async updateMany(emails: { id: string; estado: string; municipio: string }[]): Promise<void> {
    return EmailRepository.updateMany(emails);
  }

  static async delete(id: string): Promise<void> {
    return EmailRepository.delete(id);
  }

  static async getStats(): Promise<DashboardStats> {
    return EmailRepository.getStats();
  }

  static async getEmailsByState(): Promise<EmailsByState[]> {
    return EmailRepository.getEmailsByState();
  }

  static async getTopDestinatarios(): Promise<TopDestinatario[]> {
    return EmailRepository.getTopDestinatarios();
  }

  static async getTrend(): Promise<TrendData[]> {
    return EmailRepository.getTrend();
  }

  /**
   * Salva um e-mail recebido via inbound (webhook do Resend)
   * Este método é usado pela Edge Function do Supabase
   */
  static async saveFromInbound(emailData: {
    remetente: string;
    destinatario: string;
    assunto: string;
    corpo: string | null;
    data_envio: string;
    colaborador_id: string; // Adicione colaborador_id ao parâmetro
  }): Promise<Email> {
    const emailToInsert = {
      ...emailData,
      estado: null,
      municipio: null,
      classificado: false
    };

    return this.create(emailToInsert);
  }
}
