import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateJournalEntryDto {
  @IsDateString()
  entry_date: string;

  @IsString()
  content: string;

  @IsEnum(['excellent', 'good', 'neutral', 'difficult', 'bad'])
  @IsOptional()
  mood?: string;

  @IsString()
  @IsOptional()
  tasks_completed?: string;

  @IsString()
  @IsOptional()
  challenges?: string;
}

export class UpdateJournalEntryDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['excellent', 'good', 'neutral', 'difficult', 'bad'])
  @IsOptional()
  mood?: string;

  @IsString()
  @IsOptional()
  tasks_completed?: string;

  @IsString()
  @IsOptional()
  challenges?: string;
}
