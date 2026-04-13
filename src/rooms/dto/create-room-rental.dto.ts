import { IsInt, IsString, Min } from 'class-validator';

export class CreateRoomRentalDto {
  @IsString()
  customerName: string;

  @IsInt()
  roomId: number;

  @IsInt()
  @Min(1)
  hours: number;
}