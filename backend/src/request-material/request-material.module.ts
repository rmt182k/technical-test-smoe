import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMaterialService } from './request-material.service';
import { RequestMaterialController } from './request-material.controller';
import { Request } from './entities/request.entity';
import { MaterialDetail } from './entities/material-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, MaterialDetail])],
  controllers: [RequestMaterialController],
  providers: [RequestMaterialService],
})
export class RequestMaterialModule {}
