import { ProfileService } from '../../src/model/services/ProfileService';
import { ProfileRepository } from '../../src/model/repositories';
import { Profile } from '../../src/model/entities';

jest.mock('@/model/repositories', () => ({
  ProfileRepository: {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

describe('ProfileService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getById deve retornar um perfil', async () => {
    const mockProfile: Profile = {
      id: '1',
      nome: 'João Silva',
      email: 'joao@ifpi.edu.br',
      tipo_usuario: 'colaborador',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    (ProfileRepository.getById as jest.Mock).mockResolvedValue(mockProfile);

    const result = await ProfileService.getById('1');

    expect(ProfileRepository.getById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockProfile);
  });

  test('create deve criar um perfil', async () => {
    const inputProfile: Omit<Profile, 'created_at' | 'updated_at'> = {
      id: '1',
      nome: 'João Silva',
      email: 'joao@ifpi.edu.br',
      tipo_usuario: 'colaborador',
    };

    const createdProfile: Profile = {
      ...inputProfile,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    (ProfileRepository.create as jest.Mock).mockResolvedValue(createdProfile);

    const result = await ProfileService.create(inputProfile);

    expect(ProfileRepository.create).toHaveBeenCalledWith(inputProfile);
    expect(result).toEqual(createdProfile);
  });

  test('update deve atualizar um perfil', async () => {
    const updates: Partial<Profile> = {
      nome: 'João Atualizado',
    };

    const updatedProfile: Profile = {
      id: '1',
      nome: 'João Atualizado',
      email: 'joao@ifpi.edu.br',
      tipo_usuario: 'colaborador',
      created_at: '2024-01-01',
      updated_at: '2024-02-01',
    };

    (ProfileRepository.update as jest.Mock).mockResolvedValue(updatedProfile);

    const result = await ProfileService.update('1', updates);

    expect(ProfileRepository.update).toHaveBeenCalledWith('1', updates);
    expect(result).toEqual(updatedProfile);
  });
});
