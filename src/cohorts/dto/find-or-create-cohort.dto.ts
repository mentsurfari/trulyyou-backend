import { IsString, IsNotEmpty } from 'class-validator';

export class FindOrCreateCohortDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  procedure_type: string;

  @IsString()
  @IsNotEmpty()
  recovery_phase: string;
}