import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OpenBarService } from './open-bar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOpenBarDto } from './dto/create-open-bar.dto';

@Controller('open-bar')
@UseGuards(JwtAuthGuard)
export class OpenBarController {
  constructor(private readonly openBarService: OpenBarService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateOpenBarDto) {
    return this.openBarService.create(req.user.sub, dto);
  }

  @Get()
  findAll() {
    return this.openBarService.findAll();
  }
}