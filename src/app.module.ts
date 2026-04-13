import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { OpenBarModule } from './open-bar/open-bar.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    ProductsModule,
    SalesModule,
    OpenBarModule,
    RoomsModule,
  ],
})
export class AppModule {}