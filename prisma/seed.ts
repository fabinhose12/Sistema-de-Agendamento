/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: 'Fabio',
      email: 'fabio@example.com',
    },
  });

  const slot = await prisma.slot.create({
    data: {
      startTime: new Date('2026-10-10T10:00:00Z'),
      endTime: new Date('2026-10-10T11:00:00Z'),
      isBooked: false,
    },
  });

  console.log('✅ Dados de teste criados com sucesso!');
  console.log('------------------------------------');
  console.log(`🔑 USER ID : ${user.id}`);
  console.log(`🔑 SLOT ID : ${slot.id}`);
  console.log('------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });