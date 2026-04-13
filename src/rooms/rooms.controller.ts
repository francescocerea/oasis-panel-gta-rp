import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoomsService } from './rooms.service';
import { CreateRoomRentalDto } from './dto/create-room-rental.dto';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findRooms() {
    return this.roomsService.findRooms();
  }

  @Get('rentals')
  findRentals() {
    return this.roomsService.findRentals();
  }

  @Post('rentals')
  createRental(@Req() req: any, @Body() dto: CreateRoomRentalDto) {
    return this.roomsService.createRental(req.user.sub, dto);
  }

  @Patch('rentals/:id/close')
  closeRental(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.closeRental(id);
  }
}