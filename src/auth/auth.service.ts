import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: UserInterface = await this.userService.findByUsername(username);
    if (!user) return null;

    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );
    if (!isValidPassword) return null;

    return user;
  }

  async signIn(user: any) {

    const payload = {
      username: user.username,
      sub: user._id,
    };

    return {
      access_token: this.tokenService.sign(payload, {
        secret: process.env.JWT_SECRET,
        audience: process.env.APP_URL
      }),
    };
  }

  async signUp(userDto: UserDTO) {
    return this.userService.create(userDto);
  }
}
