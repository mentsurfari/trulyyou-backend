import { IsString, IsOptional } from 'class-validator';

export class UpdatePrepKitDto {
    @IsString()
    @IsOptional()
    journeyWhy: string;

    @IsString()
    @IsOptional()
    hopes: string;

    @IsString()
    @IsOptional()
    fears: string;

    @IsString()
    @IsOptional()
    desiredFeelings: string;

    @IsString()
    @IsOptional()
    medicalSnapshot: string;

    @IsString()
    @IsOptional()
    supportSystem: string;

    @IsString()
    @IsOptional()
    customQuestions: string;
}