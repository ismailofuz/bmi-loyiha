import { IsBoolean, IsEmail, IsInt, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  @IsOptional()
  rector_full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  inn?: string;

  @IsEmail()
  admin_email: string;

  @IsString()
  @MinLength(6)
  admin_password: string;

  @IsString()
  @IsOptional()
  admin_name?: string;

  @IsString()
  @IsOptional()
  admin_position?: string;
}

export class EnrollStaffDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  university_id: number;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;
}

export class UpdateUniversityDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  @IsOptional()
  rector_full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  inn?: string;
}

export class UpdateStaffDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  new_password?: string;
}

export class UpdateStaffPermissionsDto {
  @IsObject()
  @IsOptional()
  permissions?: Record<string, Record<string, boolean>>;

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;
}
