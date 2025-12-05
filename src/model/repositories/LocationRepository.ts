export interface EstadoIBGE {
  id: number;
  sigla: string;
  nome: string;
}

export interface MunicipioIBGE {
  id: number;
  nome: string;
}

const IBGE_API_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

let estadosCache: EstadoIBGE[] | null = null;
const municipiosCache: Record<string, MunicipioIBGE[]> = {};

export class LocationRepository {

  static async getEstados(): Promise<EstadoIBGE[]> {
    try {
      if (estadosCache) return estadosCache;

      const res = await fetch(`${IBGE_API_BASE}/estados?orderBy=sigla`);
      if (!res.ok) throw new Error("Erro ao buscar estados");

      const data = (await res.json()) as EstadoIBGE[];
      estadosCache = data; 

      return data;
    } catch (err) {
      console.error("Erro ao buscar estados do IBGE:", err);
      throw err;
    }
  }

  static async getMunicipios(estadoSigla?: string): Promise<MunicipioIBGE[]> {
    try {
      if (!estadoSigla) return [];

      if (municipiosCache[estadoSigla]) {
        return municipiosCache[estadoSigla];
      }

      const res = await fetch(
        `${IBGE_API_BASE}/estados/${estadoSigla}/municipios?orderBy=nome`
      );
      if (!res.ok) throw new Error("Erro ao buscar municípios");

      const data = (await res.json()) as MunicipioIBGE[];

      municipiosCache[estadoSigla] = data; 

      return data;
    } catch (err) {
      console.error("Erro ao buscar municípios do IBGE:", err);
      throw err;
    }
  }
}
