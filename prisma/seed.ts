import "dotenv/config";
import { PrismaClient, Role } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'oasis_panel',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌴 Seeding Oasis Panel...');

  await prisma.user.createMany({
    data: [
      {
        fullName: 'Direttore Oasis',
        accessCode: '111111',
        role: Role.DIRETTORE,
      },
      {
        fullName: 'Vice Direttore Oasis',
        accessCode: '222222',
        role: Role.VICE_DIRETTORE,
      },
      {
        fullName: 'Responsabile Oasis',
        accessCode: '333333',
        role: Role.RESPONSABILE,
      },
      {
        fullName: 'Dipendente Oasis',
        accessCode: '444444',
        role: Role.DIPENDENTE,
      },
      {
        fullName: 'Stagista Oasis',
        accessCode: '555555',
        role: Role.STAGISTA,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Champagne',
        sku: 'SHOP-001',
        price: '250.00',
        stock: 9999,
        category: 'Drink',
      },
      {
        name: 'Crudo di Pesce',
        sku: 'SHOP-002',
        price: '250.00',
        stock: 9999,
        category: 'Food',
      },
      {
        name: 'Pasta allo Scoglio',
        sku: 'SHOP-003',
        price: '250.00',
        stock: 9999,
        category: 'Food',
      },
      {
        name: 'Soutè di Cozze',
        sku: 'SHOP-004',
        price: '250.00',
        stock: 9999,
        category: 'Food',
      },
      {
        name: 'Rossini',
        sku: 'SHOP-005',
        price: '250.00',
        stock: 9999,
        category: 'Cocktail',
      },
      {
        name: 'Old Fashioned',
        sku: 'SHOP-006',
        price: '250.00',
        stock: 9999,
        category: 'Cocktail',
      },

      {
        name: 'Open Bar Bronze',
        sku: 'OPENBAR-001',
        price: '25000.00',
        stock: 9999,
        category: 'Open Bar',
      },
      {
        name: 'Open Bar Silver',
        sku: 'OPENBAR-002',
        price: '50000.00',
        stock: 9999,
        category: 'Open Bar',
      },
      {
        name: 'Open Bar Gold',
        sku: 'OPENBAR-003',
        price: '100000.00',
        stock: 9999,
        category: 'Open Bar',
      },
      {
        name: 'Open Bar Platinum',
        sku: 'OPENBAR-004',
        price: '250000.00',
        stock: 9999,
        category: 'Open Bar',
      },
      {
        name: 'Open Bar Diamond',
        sku: 'OPENBAR-005',
        price: '500000.00',
        stock: 9999,
        category: 'Open Bar',
      },

      {
        name: 'Ingresso Evento',
        sku: 'SERV-001',
        price: '250.00',
        stock: 9999,
        category: 'Service',
      },
      {
        name: 'Privé Lounge',
        sku: 'SERV-002',
        price: '25000.00',
        stock: 9999,
        category: 'VIP',
      },
      {
        name: 'Tavolo VIP',
        sku: 'SERV-003',
        price: '50000.00',
        stock: 9999,
        category: 'VIP',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.room.createMany({
    data: [
      {
        name: 'Camera Standard',
        code: 'ROOM-STD',
        priceHour: '10000.00',
      },
      {
        name: 'Camera Deluxe',
        code: 'ROOM-DLX',
        priceHour: '15000.00',
      },
      {
        name: 'Suite Oasis',
        code: 'ROOM-SUI',
        priceHour: '25000.00',
      },
      {
        name: 'Suite Premium',
        code: 'ROOM-PRM',
        priceHour: '50000.00',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completato!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Errore seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });