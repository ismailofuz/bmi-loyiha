import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReportDto {
  @IsDateString()
  report_date: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  week_number?: number;

  // Talaba darrov yuborishi yoki qoralama saqlashi mumkin (default: submitted)
  @IsEnum(['draft', 'submitted'])
  @IsOptional()
  status?: 'draft' | 'submitted';
}

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  location?: string;

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

  // Tasdiqlashda 5-ballik baho majburiy (servisda tekshiriladi)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  grade?: number;
}
