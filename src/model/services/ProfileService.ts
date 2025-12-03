import { Profile } from '@/model/entities';
import { ProfileRepository } from '@/model/repositories';

export class ProfileService {
  static async getById(id: string): Promise<Profile | null> {
    return ProfileRepository.getById(id);
  }

  static async create(profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile> {
    return ProfileRepository.create(profile);
  }

  static async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    return ProfileRepository.update(id, updates);
  }
}
