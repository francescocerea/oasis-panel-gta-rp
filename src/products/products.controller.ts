import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // GET ALL / FILTER
  @Get()
  findAll(@Query('category') category?: string) {
    return this.service.findAll(category);
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // CREATE
  @Post()
  @Roles(Role.DIRETTORE, Role.VICE_DIRETTORE, Role.RESPONSABILE)
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  // UPDATE
  @Patch(':id')
  @Roles(Role.DIRETTORE, Role.VICE_DIRETTORE, Role.RESPONSABILE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  @Roles(Role.DIRETTORE)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}