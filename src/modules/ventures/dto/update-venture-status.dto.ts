import { IsEnum } from 'class-validator';
import { VentureStatus } from '../interfaces';

export class UpdateVentureStatusDto {
  @IsEnum(VentureStatus)
  status: VentureStatus;
}
