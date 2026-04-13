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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.DIRETTORE, Role.VICE_DIRETTORE, Role.RESPONSABILE)
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.role);
  }

  @Post()
  @Roles(Role.DIRETTORE, Role.VICE_DIRETTORE, Role.RESPONSABILE)
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user.role, dto);
  }

  @Patch(':id')
  @Roles(Role.DIRETTORE, Role.VICE_DIRETTORE, Role.RESPONSABILE)
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.role, id, dto);
  }
}