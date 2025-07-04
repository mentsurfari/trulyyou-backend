
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}
