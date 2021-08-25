import { IsEmail, IsString } from "class-validator";

export class UserDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly userName: string;
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly password: string;
}
