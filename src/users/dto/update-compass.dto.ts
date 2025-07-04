import { IsObject, IsString, IsOptional } from 'class-validator';

export class UpdateCompassDto {
  @IsObject()
  @IsOptional()
  scores: Record<string, number>;

  @IsString()
  @IsOptional()
  profile: string;
}