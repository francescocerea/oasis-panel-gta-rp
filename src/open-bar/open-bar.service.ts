import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpenBarDto } from './dto/create-open-bar.dto';

@Injectable()
export class OpenBarService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOpenBarDto) {
    return this.prisma.openBarOrder.create({
      data: {
        customerName: dto.customerName,
        packageName: dto.packageName,
        packagePrice: dto.packagePrice.toFixed(2),
        createdById: userId,
      },
      include: {
        createdBy: true,
      },
    });
  }

  async findAll() {
    return this.prisma.openBarOrder.findMany({
      orderBy: { id: 'desc' },
      include: {
        createdBy: true,
      },
    });
  }
}