import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRegulationDto {
  @IsNumber()
  university_id: number;

  @IsString()
  title: string;

  @IsInt()
  @Min(1900)
  adoption_year: number;

  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRegulationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @Min(1900)
  @IsOptional()
  adoption_year?: number;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
