import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Il codice accesso deve essere di 6 cifre' })
  accessCode: string;
}