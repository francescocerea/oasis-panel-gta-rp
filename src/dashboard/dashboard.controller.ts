import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async stats() {
    const [
      users,
      products,
      rooms,
      sales,
      directors,
      viceDirectors,
      managers,
      employees,
      interns,
      activeUsers,
      openBarOrders,
      activeRentals,
      salesWithUsers,
      openBarWithUsers,
      rentalsWithUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.room.count(),
      this.prisma.sale.count(),
      this.prisma.user.count({ where: { role: Role.DIRETTORE } }),
      this.prisma.user.count({ where: { role: Role.VICE_DIRETTORE } }),
      this.prisma.user.count({ where: { role: Role.RESPONSABILE } }),
      this.prisma.user.count({ where: { role: Role.DIPENDENTE } }),
      this.prisma.user.count({ where: { role: Role.STAGISTA } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.openBarOrder.count(),
      this.prisma.roomRental.count({ where: { status: 'ACTIVE' } }),
      this.prisma.sale.findMany({
        select: {
          total: true,
          user: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.openBarOrder.findMany({
        select: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.roomRental.findMany({
        select: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      }),
    ]);

    const performanceMap = new Map<
      number,
      {
        userId: number;
        fullName: string;
        role: string;
        salesCount: number;
        salesRevenue: number;
        openBarCount: number;
        rentalsCount: number;
        totalOperations: number;
      }
    >();

    const ensureUser = (user: { id: number; fullName: string; role: string }) => {
      if (!performanceMap.has(user.id)) {
        performanceMap.set(user.id, {
          userId: user.id,
          fullName: user.fullName,
          role: user.role,
          salesCount: 0,
          salesRevenue: 0,
          openBarCount: 0,
          rentalsCount: 0,
          totalOperations: 0,
        });
      }

      return performanceMap.get(user.id)!;
    };

    for (const sale of salesWithUsers) {
      if (!sale.user) continue;
      const entry = ensureUser(sale.user);
      entry.salesCount += 1;
      entry.salesRevenue += Number(sale.total);
      entry.totalOperations += 1;
    }

    for (const openBar of openBarWithUsers) {
      if (!openBar.createdBy) continue;
      const entry = ensureUser(openBar.createdBy);
      entry.openBarCount += 1;
      entry.totalOperations += 1;
    }

    for (const rental of rentalsWithUsers) {
      if (!rental.createdBy) continue;
      const entry = ensureUser(rental.createdBy);
      entry.rentalsCount += 1;
      entry.totalOperations += 1;
    }

    const performance = Array.from(performanceMap.values());

    const topRevenue = [...performance]
      .sort((a, b) => b.salesRevenue - a.salesRevenue)
      .slice(0, 5);

    const topOperations = [...performance]
      .sort((a, b) => b.totalOperations - a.totalOperations)
      .slice(0, 5);

    const bestRevenueEmployee = topRevenue[0] ?? null;
    const bestOperationsEmployee = topOperations[0] ?? null;

    return {
      users,
      products,
      rooms,
      sales,
      revenueToday: 0,
      openBarToday: 0,
      roomRentalsToday: 0,
      staff: {
        directors,
        viceDirectors,
        managers,
        employees,
        interns,
        activeUsers,
      },
      operations: {
        openBarOrders,
        activeRentals,
      },
      performance: {
        bestRevenueEmployee,
        bestOperationsEmployee,
        topRevenue,
        topOperations,
      },
    };
  }
}