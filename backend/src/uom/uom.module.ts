import { Module } from '@nestjs/common';
import { UomsController } from './uom.controller';
import { UomsService } from './uom.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Uom } from './entities/uom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Uom])],
  controllers: [UomsController],
  providers: [UomsService],
})
export class UomModule {}
