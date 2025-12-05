import { Estado, Municipio } from '@/model/entities';
import { LocationRepository } from '@/model/repositories';

/**
 * Serviço responsável por fornecer dados de localização
 * como Estados e Municípios, utilizando o repositório de dados.
 *
 * @class LocationService
 */
export class LocationService {
  /**
   * Obtém a lista de estados disponíveis.
   *
   * @async
   * @static
   * @function getEstados
   * @returns {Promise<Estado[]>} Retorna uma lista de objetos Estado.
   *
   * @example
   * const estados = await LocationService.getEstados();
   * console.log(estados[0].nome); // "Piauí"
   */
  static async getEstados(): Promise<Estado[]> {
    return LocationRepository.getEstados();
  }

  /**
   * Obtém a lista de municípios de um estado específico.
   *
   * @async
   * @static
   * @function getMunicipios
   * @param {string} [estadoSigla] - Sigla do estado (ex: "PI").
   * Se não for informado, retorna municípios sem estado associado.
   * @returns {Promise<Municipio[]>} Retorna uma lista de objetos Município.
   *
   * @example
   * const municipios = await LocationService.getMunicipios("PI");
   * console.log(municipios[0].nome); // "Piripiri"
   */
  static async getMunicipios(estadoSigla?: string): Promise<Municipio[]> {
    const municipiosIBGE = await LocationRepository.getMunicipios(estadoSigla);

    return municipiosIBGE.map(m => ({
      id: m.id,
      nome: m.nome,
      estado_sigla: estadoSigla ?? '',
    }));
  }
}
