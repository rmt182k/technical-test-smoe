import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestMaterialDto } from './create-request-material.dto';

export class UpdateRequestMaterialDto extends PartialType(
  CreateRequestMaterialDto,
) {}
