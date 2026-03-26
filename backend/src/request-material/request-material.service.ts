import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestMaterialDto } from './dto/create-request-material.dto';
import { UpdateRequestMaterialDto } from './dto/update-request-material.dto';
import { Request } from './entities/request.entity';
import { MaterialDetail } from './entities/material-detail.entity';

@Injectable()
export class RequestMaterialService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    @InjectRepository(MaterialDetail)
    private readonly materialDetailRepo: Repository<MaterialDetail>,
  ) { }

  async create(createDto: CreateRequestMaterialDto) {
    const request = this.requestRepo.create({
      code: createDto.code,
      date: new Date(createDto.date),
      status: createDto.status || 'PENDING',
      department: createDto.department,
      requester_name: createDto.requester_name,
      notes: createDto.notes,
      material_details: createDto.material_details,
    });
    return await this.requestRepo.save(request);
  }

  async findAll(status?: string, date?: string, search?: string) {
    const query = this.requestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.material_details', 'material_details')
      .orderBy('request.created_at', 'DESC');

    if (status) {
      query.andWhere('request.status = :status', { status });
    }
    if (date) {
      query.andWhere('request.date = :date', { date });
    }
    if (search) {
      query.andWhere(
        '(LOWER(request.code) LIKE LOWER(:search) OR LOWER(request.requester_name) LIKE LOWER(:search) OR LOWER(request.department) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async findOne(id: string) {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['material_details'],
    });
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  async update(id: string, updateDto: UpdateRequestMaterialDto) {
    const request = await this.findOne(id);

    if (updateDto.code) request.code = updateDto.code;
    if (updateDto.date) request.date = new Date(updateDto.date);
    if (updateDto.status) request.status = updateDto.status;
    if (updateDto.department) request.department = updateDto.department;
    if (updateDto.requester_name)
      request.requester_name = updateDto.requester_name;
    if (updateDto.notes) request.notes = updateDto.notes;

    if (updateDto.material_details) {
      await this.materialDetailRepo.delete({ request_id: id });
      request.material_details = updateDto.material_details.map((item) =>
        this.materialDetailRepo.create(item),
      );
    }

    return await this.requestRepo.save(request);
  }

  async remove(id: string) {
    const request = await this.findOne(id);
    return await this.requestRepo.remove(request);
  }
}
