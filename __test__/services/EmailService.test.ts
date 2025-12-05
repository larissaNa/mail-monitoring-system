import { EmailService } from '../../src/model/services/EmailService';
import { EmailRepository } from '../../src/model/repositories';
import {
  Email,
  DashboardStats,
  EmailsByState,
  TopDestinatario,
  TrendData
} from '../../src/model/entities';

jest.mock('@/model/repositories', () => ({
  EmailRepository: {
    getAll: jest.fn(),
    getPending: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    getStats: jest.fn(),
    getEmailsByState: jest.fn(),
    getTopDestinatarios: jest.fn(),
    getTrend: jest.fn(),
  }
}));

describe('EmailService', () => {
  afterEach(() => jest.clearAllMocks());

  const mockEmail: Email = {
    id: '1',
    remetente: 'teste@a.com',
    destinatario: 'cliente@b.com',
    assunto: 'Olá',
    corpo: 'Mensagem aqui',
    data_envio: '2024-01-01',
    estado: 'PI',
    municipio: 'Teresina',
    classificado: true,
    colaborador_id: 'colab1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  };

  test('getAll deve retornar todos os emails', async () => {
    (EmailRepository.getAll as jest.Mock).mockResolvedValue([mockEmail]);

    const result = await EmailService.getAll();

    expect(EmailRepository.getAll).toHaveBeenCalled();
    expect(result).toEqual([mockEmail]);
  });

  test('getPending deve retornar emails pendentes', async () => {
    (EmailRepository.getPending as jest.Mock).mockResolvedValue([mockEmail]);

    const result = await EmailService.getPending();

    expect(EmailRepository.getPending).toHaveBeenCalled();
    expect(result).toEqual([mockEmail]);
  });

  test('getById deve retornar email por id', async () => {
    (EmailRepository.getById as jest.Mock).mockResolvedValue(mockEmail);

    const result = await EmailService.getById('1');

    expect(EmailRepository.getById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockEmail);
  });

  test('create deve criar e retornar um email', async () => {
    const newEmail = {
      remetente: 'x@y.com',
      destinatario: 'z@b.com',
      assunto: 'Assunto',
      corpo: 'corpo',
      data_envio: '2024-03-01',
      estado: 'PI',
      municipio: 'Teresina',
      classificado: false,
      colaborador_id: 'colab'
    };

    (EmailRepository.create as jest.Mock).mockResolvedValue(mockEmail);

    const result = await EmailService.create(newEmail);

    expect(EmailRepository.create).toHaveBeenCalledWith(newEmail);
    expect(result).toEqual(mockEmail);
  });

  test('update deve atualizar email', async () => {
    (EmailRepository.update as jest.Mock).mockResolvedValue(mockEmail);

    const result = await EmailService.update('1', { estado: 'CE' });

    expect(EmailRepository.update).toHaveBeenCalledWith('1', { estado: 'CE' });
    expect(result).toEqual(mockEmail);
  });

  test('updateMany deve atualizar vários emails', async () => {
    const list = [
      { id: '1', estado: 'PI', municipio: 'Teresina' },
      { id: '2', estado: 'CE', municipio: 'Fortaleza' }
    ];

    (EmailRepository.updateMany as jest.Mock).mockResolvedValue(undefined);

    const result = await EmailService.updateMany(list);

    expect(EmailRepository.updateMany).toHaveBeenCalledWith(list);
    expect(result).toBeUndefined();
  });

  test('delete deve remover email', async () => {
    (EmailRepository.delete as jest.Mock).mockResolvedValue(undefined);

    const result = await EmailService.delete('1');

    expect(EmailRepository.delete).toHaveBeenCalledWith('1');
    expect(result).toBeUndefined();
  });

  test('getStats deve retornar estatísticas', async () => {
    const mockStats: DashboardStats = {
      total: 10,
      classificados: 7,
      pendentes: 3
    };

    (EmailRepository.getStats as jest.Mock).mockResolvedValue(mockStats);

    const result = await EmailService.getStats();

    expect(EmailRepository.getStats).toHaveBeenCalled();
    expect(result).toEqual(mockStats);
  });

  test('getEmailsByState deve retornar quantidade por estado', async () => {
    const mockData: EmailsByState[] = [
      { estado: 'PI', count: 5 }
    ];

    (EmailRepository.getEmailsByState as jest.Mock).mockResolvedValue(mockData);

    const result = await EmailService.getEmailsByState();

    expect(EmailRepository.getEmailsByState).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test('getTopDestinatarios deve retornar top destinatários', async () => {
    const mockData: TopDestinatario[] = [
      { destinatario: 'cliente@x.com', count: 3 }
    ];

    (EmailRepository.getTopDestinatarios as jest.Mock).mockResolvedValue(mockData);

    const result = await EmailService.getTopDestinatarios();

    expect(EmailRepository.getTopDestinatarios).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test('getTrend deve retornar dados de tendência', async () => {
    const mockData: TrendData[] = [
      { date: '2024-01-01', count: 3 }
    ];

    (EmailRepository.getTrend as jest.Mock).mockResolvedValue(mockData);

    const result = await EmailService.getTrend();

    expect(EmailRepository.getTrend).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test('saveFromInbound deve montar email corretamente e chamar create', async () => {
    const inbound = {
      remetente: 'a@a.com',
      destinatario: 'b@b.com',
      assunto: 'Assunto',
      corpo: 'Corpo',
      data_envio: '2024-02-01',
      colaborador_id: 'colab123'
    };

    (EmailRepository.create as jest.Mock).mockResolvedValue(mockEmail);

    const result = await EmailService.saveFromInbound(inbound);

    expect(EmailRepository.create).toHaveBeenCalledWith({
      ...inbound,
      estado: null,
      municipio: null,
      classificado: false
    });

    expect(result).toEqual(mockEmail);
  });
});
