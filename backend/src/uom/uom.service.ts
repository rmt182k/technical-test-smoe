import { Injectable } from '@nestjs/common';
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

  create(data: Partial<Uom>) {
    const newRecord = this.repo.create(data);
    return this.repo.save(newRecord);
  }

  async update(id: string, data: Partial<Uom>) {
    await this.repo.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { success: true };
  }
}
