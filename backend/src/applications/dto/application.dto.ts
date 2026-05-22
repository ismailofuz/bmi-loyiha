import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsInt()
  student_id: number;

  @IsInt()
  company_id: number;

  @IsInt()
  @IsOptional()
  supervisor_id?: number;

  @IsDateString()
  internship_start: string;

  @IsDateString()
  internship_end: string;
}

export class UpdateApplicationDto {
  @IsInt()
  @IsOptional()
  company_id?: number;

  @IsInt()
  @IsOptional()
  supervisor_id?: number;

  @IsDateString()
  internship_start: string;

  @IsDateString()
  internship_end: string;
}

export class RespondApplicationDto {
  @IsEnum(['accepted', 'rejected'])
  status: 'accepted' | 'rejected';
}
