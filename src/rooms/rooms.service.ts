import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomRentalDto } from './dto/create-room-rental.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findRooms() {
    return this.prisma.room.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async createRental(userId: number, dto: CreateRoomRentalDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });

    if (!room) {
      throw new BadRequestException('Camera non trovata');
    }

    const total = Number(room.priceHour) * dto.hours;

    return this.prisma.roomRental.create({
      data: {
        customerName: dto.customerName,
        hours: dto.hours,
        total: total.toFixed(2),
        roomId: room.id,
        createdById: userId,
        status: 'ACTIVE',
      },
      include: {
        room: true,
        createdBy: true,
      },
    });
  }

  async findRentals() {
    return this.prisma.roomRental.findMany({
      orderBy: { id: 'desc' },
      include: {
        room: true,
        createdBy: true,
      },
    });
  }

  async closeRental(id: number) {
    return this.prisma.roomRental.update({
      where: { id },
      data: {
        status: 'CLOSED',
      },
      include: {
        room: true,
        createdBy: true,
      },
    });
  }
}