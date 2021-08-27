import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signIn')
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('signUp')
  async signUp(@Body() userDto: UserDTO) {
    return await this.authService.signUp(userDto);
  }
}
