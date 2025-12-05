import { LocationService } from '../../src/model/services/LocationService';
import { LocationRepository } from '../../src/model/repositories';
import { Estado, Municipio } from '../../src/model/entities';

jest.mock('@/model/repositories', () => ({
  LocationRepository: {
    getEstados: jest.fn(),
    getMunicipios: jest.fn(),
  },
}));

describe('LocationService', () => {
  afterEach(() => jest.clearAllMocks());

  test('getEstados deve retornar a lista de estados', async () => {
    const mockEstados: Estado[] = [
      { id: 1, nome: 'Piauí', sigla: 'PI' },
      { id: 2, nome: 'Ceará', sigla: 'CE' },
    ];

    (LocationRepository.getEstados as jest.Mock).mockResolvedValue(mockEstados);

    const result = await LocationService.getEstados();

    expect(LocationRepository.getEstados).toHaveBeenCalled();
    expect(result).toEqual(mockEstados);
  });

  test('getMunicipios deve retornar municípios quando passar estadoSigla', async () => {
    const mockMunicipios: Municipio[] = [
      { id: 1, nome: 'Teresina', estado_sigla: 'PI' },
      { id: 2, nome: 'Parnaíba', estado_sigla: 'PI' },
    ];

    (LocationRepository.getMunicipios as jest.Mock).mockResolvedValue(mockMunicipios);

    const result = await LocationService.getMunicipios('PI');

    expect(LocationRepository.getMunicipios).toHaveBeenCalledWith('PI');
    expect(result).toEqual(mockMunicipios);
  });

  test('getMunicipios deve funcionar sem parâmetro (sigla opcional)', async () => {
    const mockMunicipios: Municipio[] = [
        { id: 1, nome: 'Qualquer Cidade', estado_sigla: '' },
    ];

    (LocationRepository.getMunicipios as jest.Mock).mockResolvedValue(mockMunicipios);

    const result = await LocationService.getMunicipios();

    expect(LocationRepository.getMunicipios).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockMunicipios);
  });
});
