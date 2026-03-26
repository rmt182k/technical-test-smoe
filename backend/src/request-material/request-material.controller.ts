import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RequestMaterialService } from './request-material.service';
import { CreateRequestMaterialDto } from './dto/create-request-material.dto';
import { UpdateRequestMaterialDto } from './dto/update-request-material.dto';

@Controller('request-material')
export class RequestMaterialController {
  constructor(
    private readonly requestMaterialService: RequestMaterialService,
  ) {}

  @Post()
  create(@Body() createRequestMaterialDto: CreateRequestMaterialDto) {
    return this.requestMaterialService.create(createRequestMaterialDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
  ) {
    return this.requestMaterialService.findAll(status, date, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestMaterialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestMaterialDto: UpdateRequestMaterialDto,
  ) {
    return this.requestMaterialService.update(id, updateRequestMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestMaterialService.remove(id);
  }
}
