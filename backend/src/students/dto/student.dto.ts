import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  university_id: number;

  @IsString()
  full_name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @IsOptional()
  faculty_id?: number;

  @IsInt()
  @IsOptional()
  direction_id?: number;

  @IsInt()
  @IsOptional()
  course_id?: number;

  @IsInt()
  @IsOptional()
  group_id?: number;

  @IsInt()
  @IsOptional()
  edu_form_id?: number;

  @IsInt()
  @IsOptional()
  edu_type_id?: number;

  @IsInt()
  @IsOptional()
  edu_lang_id?: number;
}

export class EnrollStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  full_name: string;

  @IsInt()
  university_id: number;

  @IsString()
  @IsOptional()
  passport_serial?: string;

  @IsString()
  @IsOptional()
  pin?: string;

  @IsInt()
  @IsOptional()
  faculty_id?: number;

  @IsInt()
  @IsOptional()
  direction_id?: number;

  @IsInt()
  @IsOptional()
  course_id?: number;

  @IsInt()
  @IsOptional()
  group_id?: number;

  @IsInt()
  @IsOptional()
  edu_form_id?: number;

  @IsInt()
  @IsOptional()
  edu_type_id?: number;

  @IsInt()
  @IsOptional()
  edu_lang_id?: number;
}

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  passport_serial?: string;

  @IsString()
  @IsOptional()
  pin?: string;

  @IsInt()
  @IsOptional()
  faculty_id?: number;

  @IsInt()
  @IsOptional()
  direction_id?: number;

  @IsInt()
  @IsOptional()
  course_id?: number;

  @IsInt()
  @IsOptional()
  group_id?: number;

  @IsInt()
  @IsOptional()
  edu_form_id?: number;

  @IsInt()
  @IsOptional()
  edu_type_id?: number;

  @IsInt()
  @IsOptional()
  edu_lang_id?: number;
}
