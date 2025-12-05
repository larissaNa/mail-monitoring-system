import { EmailRepository } from '../../src/model/repositories/EmailRepository';
import { supabase } from '../../src/infrastructure/supabase/client';

// Objeto que simula o retorno de supabase.from()
const mockFrom: any = {
  select: jest.fn(() => mockFrom),
  order: jest.fn(() => mockFrom),
  eq: jest.fn(() => mockFrom),
  insert: jest.fn(() => mockFrom),
  update: jest.fn(() => mockFrom),
  delete: jest.fn(() => mockFrom),
  single: jest.fn(() => mockFrom),
  maybeSingle: jest.fn(() => mockFrom),
  not: jest.fn(() => mockFrom),
  gte: jest.fn(() => mockFrom),
};

jest.mock('@/infrastructure/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => mockFrom),
  },
}));

describe('EmailRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll deve retornar lista de emails', async () => {
    (mockFrom.order as jest.Mock).mockResolvedValueOnce({
      data: [{ id: '1', assunto: 'teste' }],
      error: null,
    });

    const result = await EmailRepository.getAll();
    expect(result).toEqual([{ id: '1', assunto: 'teste' }]);
    expect(supabase.from).toHaveBeenCalledWith('emails');
    expect(mockFrom.order).toHaveBeenCalledWith('data_envio', { ascending: false });
  });

  it('getById deve retornar email único', async () => {
    (mockFrom.maybeSingle as jest.Mock).mockResolvedValueOnce({
      data: { id: '123', assunto: 'teste' },
      error: null,
    });

    const result = await EmailRepository.getById('123');
    expect(result).toEqual({ id: '123', assunto: 'teste' });
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '123');
  });

  it('create deve inserir e retornar email', async () => {
    (mockFrom.single as jest.Mock).mockResolvedValueOnce({
      data: { id: '1', assunto: 'novo email' },
      error: null,
    });

    const result = await EmailRepository.create({ assunto: 'novo email' } as any);
    expect(result).toEqual({ id: '1', assunto: 'novo email' });
    expect(mockFrom.insert).toHaveBeenCalledWith({ assunto: 'novo email' });
  });

  it('update deve atualizar e retornar email', async () => {
    (mockFrom.single as jest.Mock).mockResolvedValueOnce({
      data: { id: '1', assunto: 'atualizado' },
      error: null,
    });

    const result = await EmailRepository.update('1', { assunto: 'atualizado' });
    expect(result).toEqual({ id: '1', assunto: 'atualizado' });
    expect(mockFrom.update).toHaveBeenCalledWith({ assunto: 'atualizado' });
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '1');
  });

  it('delete deve chamar supabase.delete', async () => {
    (mockFrom.eq as jest.Mock).mockResolvedValueOnce({ error: null });

    await EmailRepository.delete('1');
    expect(mockFrom.delete).toHaveBeenCalled();
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '1');
  });

  it('getStats deve calcular estatísticas corretamente', async () => {
    (mockFrom.select as jest.Mock).mockResolvedValueOnce({
      data: [{ classificado: true }, { classificado: false }],
      error: null,
    });

    const result = await EmailRepository.getStats();
    expect(result).toEqual({ total: 2, classificados: 1, pendentes: 1 });
  });

  it('getEmailsByState deve agrupar por estado', async () => {
    (mockFrom.not as jest.Mock).mockResolvedValueOnce({
      data: [{ estado: 'PI' }, { estado: 'PI' }, { estado: 'CE' }],
      error: null,
    });

    const result = await EmailRepository.getEmailsByState();
    expect(result).toEqual([
      { estado: 'PI', count: 2 },
      { estado: 'CE', count: 1 },
    ]);
  });

  it('getTopDestinatarios deve retornar top 3 destinatários', async () => {
    (mockFrom.select as jest.Mock).mockResolvedValueOnce({
      data: [
        { destinatario: 'a@teste.com, b@teste.com' },
        { destinatario: 'a@teste.com' },
        { destinatario: 'c@teste.com' },
      ],
      error: null,
    });

    const result = await EmailRepository.getTopDestinatarios();
    expect(result).toEqual([
      { destinatario: 'a@teste.com', count: 2 },
      { destinatario: 'b@teste.com', count: 1 },
      { destinatario: 'c@teste.com', count: 1 },
    ]);
  });
});
