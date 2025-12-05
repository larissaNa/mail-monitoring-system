import { Email, DashboardStats, EmailsByState, TopDestinatario, TrendData } from '@/model/entities';
import { EmailRepository } from '@/model/repositories';

/**
 * Serviço responsável por operações relacionadas a e-mails,
 * incluindo criação, atualização, exclusão e estatísticas.
 *
 * @class EmailService
 */
export class EmailService {
  /**
   * Obtém todos os e-mails cadastrados.
   *
   * @async
   * @static
   * @returns {Promise<Email[]>} Lista completa de e-mails.
   *
   * @example
   * const emails = await EmailService.getAll();
   */
  static async getAll(): Promise<Email[]> {
    return EmailRepository.getAll();
  }

  /**
   * Obtém e-mails pendentes de processamento.
   *
   * @async
   * @static
   * @returns {Promise<Email[]>} Lista de e-mails pendentes.
   *
   * @example
   * const pendentes = await EmailService.getPending();
   */
  static async getPending(): Promise<Email[]> {
    return EmailRepository.getPending();
  }

  /**
   * Busca um e-mail pelo ID.
   *
   * @async
   * @static
   * @param {string} id - Identificador único do e-mail.
   * @returns {Promise<Email|null>} Retorna o e-mail encontrado ou `null`.
   *
   * @example
   * const email = await EmailService.getById("123");
   */
  static async getById(id: string): Promise<Email | null> {
    return EmailRepository.getById(id);
  }

  /**
   * Cria um novo e-mail.
   *
   * @async
   * @static
   * @param {Omit<Email, 'id' | 'created_at' | 'updated_at'>} email - Dados do e-mail sem os campos automáticos.
   * @returns {Promise<Email>} Retorna o e-mail criado.
   *
   * @example
   * const novoEmail = await EmailService.create({
   *   remetente: "larissa@email.com",
   *   destinatario: "destino@email.com",
   *   assunto: "Teste",
   *   corpo: "Mensagem de teste"
   * });
   */
  static async create(email: Omit<Email, 'id' | 'created_at' | 'updated_at'>): Promise<Email> {
    return EmailRepository.create(email);
  }

  /**
   * Atualiza um e-mail existente.
   *
   * @async
   * @static
   * @param {string} id - Identificador único do e-mail.
   * @param {Partial<Email>} updates - Campos a serem atualizados.
   * @returns {Promise<Email>} Retorna o e-mail atualizado.
   *
   * @example
   * const atualizado = await EmailService.update("123", { assunto: "Novo assunto" });
   */
  static async update(id: string, updates: Partial<Email>): Promise<Email> {
    return EmailRepository.update(id, updates);
  }

  /**
   * Atualiza múltiplos e-mails em lote.
   *
   * @async
   * @static
   * @param {Array<{id: string, estado: string, municipio: string}>} emails - Lista de e-mails com dados atualizados.
   * @returns {Promise<void>} Não retorna valor.
   *
   * @example
   * await EmailService.updateMany([{ id: "123", estado: "PI", municipio: "Piripiri" }]);
   */
  static async updateMany(emails: { id: string; estado: string; municipio: string }[]): Promise<void> {
    return EmailRepository.updateMany(emails);
  }

  /**
   * Exclui um e-mail pelo ID.
   *
   * @async
   * @static
   * @param {string} id - Identificador único do e-mail.
   * @returns {Promise<void>} Não retorna valor.
   *
   * @example
   * await EmailService.delete("123");
   */
  static async delete(id: string): Promise<void> {
    return EmailRepository.delete(id);
  }

  /**
   * Obtém estatísticas gerais do dashboard.
   *
   * @async
   * @static
   * @returns {Promise<DashboardStats>} Estatísticas agregadas.
   *
   * @example
   * const stats = await EmailService.getStats();
   */
  static async getStats(): Promise<DashboardStats> {
    return EmailRepository.getStats();
  }

  /**
   * Obtém e-mails agrupados por estado.
   *
   * @async
   * @static
   * @returns {Promise<EmailsByState[]>} Lista de e-mails por estado.
   *
   * @example
   * const porEstado = await EmailService.getEmailsByState();
   */
  static async getEmailsByState(): Promise<EmailsByState[]> {
    return EmailRepository.getEmailsByState();
  }

  /**
   * Obtém os destinatários mais frequentes.
   *
   * @async
   * @static
   * @returns {Promise<TopDestinatario[]>} Lista dos principais destinatários.
   *
   * @example
   * const top = await EmailService.getTopDestinatarios();
   */
  static async getTopDestinatarios(): Promise<TopDestinatario[]> {
    return EmailRepository.getTopDestinatarios();
  }

  /**
   * Obtém dados de tendência de envio de e-mails.
   *
   * @async
   * @static
   * @returns {Promise<TrendData[]>} Dados de tendência.
   *
   * @example
   * const trend = await EmailService.getTrend();
   */
  static async getTrend(): Promise<TrendData[]> {
    return EmailRepository.getTrend();
  }

  /**
   * Salva um e-mail recebido via inbound (webhook do Resend).
   * Este método é usado pela Edge Function do Supabase.
   *
   * @async
   * @static
   * @param {Object} emailData - Dados do e-mail recebido.
   * @param {string} emailData.remetente - Endereço do remetente.
   * @param {string} emailData.destinatario - Endereço do destinatário.
   * @param {string} emailData.assunto - Assunto do e-mail.
   * @param {string|null} emailData.corpo - Corpo do e-mail.
   * @param {string} emailData.data_envio - Data de envio.
   * @param {string} emailData.colaborador_id - Identificador do colaborador associado.
   * @returns {Promise<Email>} Retorna o e-mail salvo.
   *
   * @example
   * const inbound = await EmailService.saveFromInbound({
   *   remetente: "remetente@email.com",
   *   destinatario: "destino@email.com",
   *   assunto: "Assunto inbound",
   *   corpo: "Conteúdo inbound",
   *   data_envio: "2025-12-05T17:00:00Z",
   *   colaborador_id: "456"
   * });
   */
  static async saveFromInbound(emailData: {
    remetente: string;
    destinatario: string;
    assunto: string;
    corpo: string | null;
    data_envio: string;
    colaborador_id: string;
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
