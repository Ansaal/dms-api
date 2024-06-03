import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':dealershipId')
  async generateToken(@Param('dealershipId') dealershipId: string) {
    return {
      token: await this.authService.generateToken(dealershipId),
    };
  }
}
