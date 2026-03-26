import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } as any });
  }

  async create(data: Partial<User>) {
    if (data.email) {
      const existing = await this.repo.findOne({ where: { email: data.email } as any });
      if (existing) {
        throw new ConflictException(`User with email ${data.email} already exists`);
      }
    }
    const newRecord = this.repo.create(data);
    return this.repo.save(newRecord);
  }

  async update(id: string, data: Partial<User>) {
    const current = await this.findOne(id);
    if (!current) return null;

    if (data.email && data.email !== (current as any).email) {
      const existing = await this.repo.findOne({ where: { email: data.email } as any });
      if (existing) {
        throw new ConflictException(`User with email ${data.email} already exists`);
      }
    }
    await this.repo.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { success: true };
  }
}
