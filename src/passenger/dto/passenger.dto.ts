import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PassengerDTO {
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
