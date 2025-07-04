
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDiscoverabilityDto {
  @IsBoolean()
  @IsNotEmpty()
  isDiscoverable: boolean;
}
