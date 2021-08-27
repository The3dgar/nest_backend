import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UserDTO {
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly username: string;
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
}
