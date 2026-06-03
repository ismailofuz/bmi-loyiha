import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  internship_student_id: number;

  @IsDateString()
  date: string;

  @IsBoolean()
  @IsOptional()
  is_present?: boolean;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  grade?: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CheckInDto {
  // Talaba o'zi check-in qiladi: sana (default bugun) va lokatsiya nomi
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateAttendanceDto {
  @IsBoolean()
  @IsOptional()
  is_present?: boolean;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  grade?: number;

  @IsString()
  @IsOptional()
  note?: string;
}
