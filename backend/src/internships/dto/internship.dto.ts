import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateInternshipDto {
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

export class UpdateInternshipDto {
  @IsInt()
  @IsOptional()
  supervisor_id?: number;

  @IsDateString()
  @IsOptional()
  internship_start?: string;

  @IsDateString()
  @IsOptional()
  internship_end?: string;
}

export class RespondInternshipDto {
  @IsEnum(['accepted', 'cancelled'])
  status: 'accepted' | 'cancelled';
}

export class AddStudentDto {
  @IsInt()
  student_id: number;
}

export class RespondStudentDto {
  @IsEnum(['accepted', 'cancelled'])
  status: 'accepted' | 'cancelled';

  // Korxona qabul qilishda talabaga biriktiriladigan mentor (ixtiyoriy;
  // ko'rsatilmasa qabul qilgan mentorning o'zi biriktiriladi)
  @IsInt()
  @IsOptional()
  mentor_id?: number;
}
