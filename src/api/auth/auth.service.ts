import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { DealershipService } from '../../service/dealership/dealership.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly dealershipService: DealershipService,
  ) {}

  async generateToken(dealershipId: string): Promise<string> {
    const payload = { dealershipId };
    const dealership =
      await this.dealershipService.getDealershipById(dealershipId);
    if (!dealership) {
      throw new NotFoundException(dealershipId);
    }

    return this.jwtService.sign(payload);
  }

  async validateDealership(dealershipId: string): Promise<any> {
    return this.prisma.dealership.findUnique({ where: { dealershipId } });
  }
}
