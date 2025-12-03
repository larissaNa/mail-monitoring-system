import { Estado, Municipio } from '@/types';

const IBGE_API_BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades';

export const locationService = {
  async getEstados(): Promise<Estado[]> {
    try {
      const response = await fetch(`${IBGE_API_BASE}/estados?orderBy=sigla`);
      if (!response.ok) throw new Error('Erro ao buscar estados');
      
      const data: any[] = await response.json();
      return data.map((estado) => ({
        id: estado.id,
        sigla: estado.sigla,
        nome: estado.nome,
      })) as Estado[];
    } catch (error) {
      console.error('Erro ao buscar estados do IBGE:', error);
      throw error;
    }
  },

  async getMunicipios(estadoSigla?: string): Promise<Municipio[]> {
    try {
      if (!estadoSigla) return [];

      const response = await fetch(
        `${IBGE_API_BASE}/estados/${estadoSigla}/municipios?orderBy=nome`
      );
      if (!response.ok) throw new Error('Erro ao buscar municípios');
      
      const data: any[] = await response.json();
      return data.map((municipio, index) => ({
        id: index,
        nome: municipio.nome,
        estado_sigla: estadoSigla,
      })) as Municipio[];
    } catch (error) {
      console.error('Erro ao buscar municípios do IBGE:', error);
      throw error;
    }
  }
};
