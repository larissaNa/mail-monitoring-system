import { Profile } from '@/model/entities';
import { ProfileRepository } from '@/model/repositories';

/**
 * Serviço responsável por operações relacionadas ao perfil de usuário.
 *
 * @class ProfileService
 */
export class ProfileService {
  /**
   * Busca um perfil pelo ID.
   *
   * @async
   * @static
   * @function getById
   * @param {string} id - Identificador único do perfil.
   * @returns {Promise<Profile|null>} Retorna o perfil encontrado ou `null` se não existir.
   *
   * @example
   * const profile = await ProfileService.getById("123");
   * if (profile) {
   *   console.log(profile.name);
   * }
   */
  static async getById(id: string): Promise<Profile | null> {
    return ProfileRepository.getById(id);
  }

  /**
   * Cria um novo perfil.
   *
   * @async
   * @static
   * @function create
   * @param {Omit<Profile, 'created_at' | 'updated_at'>} profile - Dados do perfil sem os campos automáticos.
   * @returns {Promise<Profile>} Retorna o perfil criado com os campos completos.
   *
   * @example
   * const newProfile = await ProfileService.create({
   *   name: "Larissa",
   *   email: "larissa@email.com"
   * });
   * console.log(newProfile.id);
   */
  static async create(profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile> {
    return ProfileRepository.create(profile);
  }

  /**
   * Atualiza um perfil existente.
   *
   * @async
   * @static
   * @function update
   * @param {string} id - Identificador único do perfil.
   * @param {Partial<Profile>} updates - Campos a serem atualizados.
   * @returns {Promise<Profile>} Retorna o perfil atualizado.
   *
   * @example
   * const updatedProfile = await ProfileService.update("123", { email: "novo@email.com" });
   * console.log(updatedProfile.email);
   */
  static async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    return ProfileRepository.update(id, updates);
  }
}
