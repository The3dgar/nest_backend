import { IsEmail, IsString } from 'class-validator';

export class PassengerDTO {
  @IsString()
  readonly name: string;
  @IsEmail()
  readonly email: string;
}
