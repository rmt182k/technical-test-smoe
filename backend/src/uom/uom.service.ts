import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uom } from './entities/uom.entity';

@Injectable()
export class UomsService {
  constructor(
    @InjectRepository(Uom)
    private readonly repo: Repository<Uom>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } as any });
  }

  async create(data: Partial<Uom>) {
    if (data.code) {
      const existing = await this.repo.findOne({ where: { code: data.code } as any });
      if (existing) {
        throw new ConflictException(`UOM with code ${data.code} already exists`);
      }
    }
    const newRecord = this.repo.create(data);
    return this.repo.save(newRecord);
  }

  async update(id: string, data: Partial<Uom>) {
    const current = await this.findOne(id);
    if (!current) return null;

    if (data.code && data.code !== (current as any).code) {
      const existing = await this.repo.findOne({ where: { code: data.code } as any });
      if (existing) {
        throw new ConflictException(`UOM with code ${data.code} already exists`);
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
