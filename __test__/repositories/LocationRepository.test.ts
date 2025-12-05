import { LocationRepository } from '../../src/model/repositories/LocationRepository';
import type { EstadoIBGE, MunicipioIBGE } from '../../src/model/repositories/LocationRepository';

describe('LocationRepository', () => {
  beforeEach(() => {
    LocationRepository.__resetCache(); // limpa cache real
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('getEstados', () => {
    it('deve buscar estados do IBGE quando não há cache', async () => {
      const mockEstados: EstadoIBGE[] = [
        { id: 1, sigla: 'PI', nome: 'Piauí' },
        { id: 2, sigla: 'CE', nome: 'Ceará' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEstados,
      });

      const result = await LocationRepository.getEstados();
      expect(result).toEqual(mockEstados);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=sigla'
      );
    });

    it('deve retornar do cache se já buscou antes', async () => {
      const mockEstados: EstadoIBGE[] = [{ id: 1, sigla: 'PI', nome: 'Piauí' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEstados,
      });

      await LocationRepository.getEstados(); // popula cache
      const result = await LocationRepository.getEstados(); // usa cache

      expect(result).toEqual(mockEstados);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro se resposta não for ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => [],
      });

      await expect(LocationRepository.getEstados()).rejects.toThrow('Erro ao buscar estados');
    });
  });

  describe('getMunicipios', () => {
    it('deve retornar lista de municípios para um estado', async () => {
      const mockMunicipios: MunicipioIBGE[] = [
        { id: 1, nome: 'Piripiri' },
        { id: 2, nome: 'Teresina' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMunicipios,
      });

      const result = await LocationRepository.getMunicipios('PI');
      expect(result).toEqual(mockMunicipios);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados/PI/municipios?orderBy=nome'
      );
    });

    it('deve retornar [] se não passar estadoSigla', async () => {
      const result = await LocationRepository.getMunicipios();
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('deve retornar do cache se já buscou antes', async () => {
      const mockMunicipios: MunicipioIBGE[] = [{ id: 1, nome: 'Piripiri' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMunicipios,
      });

      await LocationRepository.getMunicipios('PI'); // popula cache
      const result = await LocationRepository.getMunicipios('PI'); // usa cache

      expect(result).toEqual(mockMunicipios);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro se resposta não for ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => [],
      });

      await expect(LocationRepository.getMunicipios('PI')).rejects.toThrow('Erro ao buscar municípios');
    });
  });
});
