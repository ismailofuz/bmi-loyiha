import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateFacultyDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsInt()
  @IsOptional()
  university_id?: number;
}

export class UpdateFacultyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsInt()
  faculty_id: number;
}

export class UpdateDepartmentDto {
  @IsString()
  @IsOptional()
  name?: string;
}

// ── Degrees ────────────────────────────────────────────────────────────────

export class CreateDegreeDto {
  @IsString()
  name: string;
}

export class UpdateDegreeDto {
  @IsString()
  @IsOptional()
  name?: string;
}

// ── Education Meta ─────────────────────────────────────────────────────────

export class CreateEducationFormDto {
  @IsString()
  name: string;
}

export class UpdateEducationFormDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreateEducationTypeDto {
  @IsString()
  name: string;
}

export class UpdateEducationTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreateEducationLanguageDto {
  @IsString()
  name: string;
}

export class UpdateEducationLanguageDto {
  @IsString()
  @IsOptional()
  name?: string;
}

// ── Directions ─────────────────────────────────────────────────────────────

export class CreateDirectionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsInt()
  faculty_id: number;

  @IsInt()
  @IsOptional()
  edu_form_id?: number;

  @IsInt()
  @IsOptional()
  edu_type_id?: number;

  @IsInt()
  @IsOptional()
  edu_lang_id?: number;

  @IsInt()
  @IsOptional()
  degree_id?: number;
}

export class UpdateDirectionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsInt()
  @IsOptional()
  edu_form_id?: number;

  @IsInt()
  @IsOptional()
  edu_type_id?: number;

  @IsInt()
  @IsOptional()
  edu_lang_id?: number;

  @IsInt()
  @IsOptional()
  degree_id?: number;
}

// ── Courses ────────────────────────────────────────────────────────────────

export class CreateCourseDto {
  @IsInt()
  direction_id: number;

  @IsInt()
  @Min(1)
  @Max(6)
  number: number;
}

export class UpdateCourseDto {
  @IsInt()
  @Min(1)
  @Max(6)
  @IsOptional()
  number?: number;
}

// ── Groups ─────────────────────────────────────────────────────────────────

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsInt()
  course_id: number;
}

export class UpdateGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  course_id?: number;
}
