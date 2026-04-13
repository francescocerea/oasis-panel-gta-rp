import { IsInt, IsString, Min } from 'class-validator';

export class CreateOpenBarDto {
  @IsString()
  customerName: string;

  @IsString()
  packageName: string;

  @IsInt()
  @Min(1)
  packagePrice: number;
}