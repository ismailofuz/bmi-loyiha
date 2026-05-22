import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  @Min(1)
  week_number: number;

  @IsString()
  content: string;
}

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['draft', 'submitted'])
  @IsOptional()
  status?: string;
}

export class ReviewReportDto {
  @IsEnum(['approved', 'rejected'])
  status: string;

  @IsString()
  @IsOptional()
  reviewer_feedback?: string;
}
