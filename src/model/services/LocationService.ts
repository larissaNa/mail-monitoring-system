import { Estado, Municipio } from '@/model/entities';
import { LocationRepository } from '@/model/repositories';

export class LocationService {
  static async getEstados(): Promise<Estado[]> {
    return LocationRepository.getEstados();
  }

  static async getMunicipios(estadoSigla?: string): Promise<Municipio[]> {
    return LocationRepository.getMunicipios(estadoSigla);
  }
}
