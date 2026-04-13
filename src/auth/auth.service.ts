import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        accessCode: dto.accessCode,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Codice accesso non valido');
    }

    const payload = {
      sub: user.id,
      fullName: user.fullName,
      role: user.role,
      accessCode: user.accessCode,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        accessCode: user.accessCode,
      },
    };
  }

  async me(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        role: true,
        accessCode: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}