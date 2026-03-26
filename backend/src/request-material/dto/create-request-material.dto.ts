import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMaterialDetailDto {
  @IsString()
  @IsNotEmpty()
  material_description: string;

  @IsString()
  @IsNotEmpty()
  material_type: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit_of_measure: string;

  @IsNumber()
  @IsOptional()
  estimated_cost?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  supplier_preference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRequestMaterialDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  requester_name?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialDetailDto)
  material_details: CreateMaterialDetailDto[];
}
