import { ProfileRepository } from '../../src/model/repositories/ProfileRepository';
import { supabase } from '../../src/infrastructure/supabase/client';
import { Profile } from '../../src/model/entities';

// ------- MOCK DO SUPABASE -------
jest.mock('@/infrastructure/supabase/client', () => {
  const mockFrom = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis()
  };

  return {
    supabase: {
      from: jest.fn(() => mockFrom),
      __mockFrom: mockFrom
    }
  };
});

const mockFrom = (supabase as any).__mockFrom;

describe('ProfileRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProfile: Profile = {
    id: '1',
    nome: 'João',
    email: 'joao@test.com',
    tipo_usuario: 'admin',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  };

  // ------------- getById -------------------
  test('getById retorna um perfil quando sucesso', async () => {
    mockFrom.maybeSingle.mockResolvedValue({
      data: mockProfile,
      error: null
    });

    const result = await ProfileRepository.getById('1');

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockFrom.select).toHaveBeenCalledWith('*');
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toEqual(mockProfile);
  });

  test('getById lança erro quando supabase retorna erro', async () => {
    mockFrom.maybeSingle.mockResolvedValue({
      data: null,
      error: new Error('Erro supabase')
    });

    await expect(ProfileRepository.getById('1')).rejects.toThrow('Erro supabase');
  });

  // ------------- create ------------------
  test('create insere e retorna um perfil', async () => {
    const newProfile: Omit<Profile, 'created_at' | 'updated_at'> = {
      id: '1',
      nome: 'João',
      email: 'joao@test.com',
      tipo_usuario: 'admin'
    };

    mockFrom.single.mockResolvedValue({
      data: mockProfile,
      error: null
    });

    const result = await ProfileRepository.create(newProfile);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockFrom.insert).toHaveBeenCalledWith(newProfile);
    expect(result).toEqual(mockProfile);
  });

  test('create lança erro quando supabase retorna erro', async () => {
    mockFrom.single.mockResolvedValue({
      data: null,
      error: new Error('Erro ao criar')
    });

    await expect(
      ProfileRepository.create({
        id: '1',
        nome: 'João',
        email: 'joao@test.com',
        tipo_usuario: 'admin'
      })
    ).rejects.toThrow('Erro ao criar');
  });

  // ------------- update ------------------
  test('update modifica e retorna o perfil', async () => {
    mockFrom.single.mockResolvedValue({
      data: mockProfile,
      error: null
    });

    const result = await ProfileRepository.update('1', { nome: 'Novo nome' });

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(mockFrom.update).toHaveBeenCalledWith({ nome: 'Novo nome' });
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toEqual(mockProfile);
  });

  test('update lança erro quando supabase retorna erro', async () => {
    mockFrom.single.mockResolvedValue({
      data: null,
      error: new Error('Erro no update')
    });

    await expect(ProfileRepository.update('1', {}))
      .rejects.toThrow('Erro no update');
  });
});
