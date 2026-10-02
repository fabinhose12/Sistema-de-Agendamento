import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runStressTest() {
  console.log('🔄 A preparar ambiente limpo para o teste de carga...');

  try {
    await prisma.booking.deleteMany();
    await prisma.slot.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: 'Stress Tester',
        email: 'stress@test.com',
      },
    });

    const slot = await prisma.slot.create({
      data: {
        startTime: new Date('2026-10-10T10:00:00Z'),
        endTime: new Date('2026-10-10T11:00:00Z'),
        isBooked: false,
      },
    });

    console.log(`🎯 Slot criado no Banco: ${slot.id}`);
    console.log(`👤 Utilizador criado no Banco: ${user.id}`);
    console.log('🚀 A disparar 100 requisições SIMULTÂNEAS via Promise.all...\n');

    const payload = {
      userId: user.id,
      slotId: slot.id,
    };

    const requests = Array.from({ length: 100 }).map(() =>
      fetch('http://127.0.0.1:3001/api/bookings', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    );

    const responses = await Promise.all(requests);

    // Mapeia os códigos de status das respostas HTTP
    const statusCounts = responses.reduce((acc, res) => {
      acc[res.status] = (acc[res.status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    console.log('📊 === RESULTADO DOS DISPAROS ===');
    console.log('Contagem de Status HTTP:', statusCounts);
    console.log('----------------------------------------');

    // Pausa para permitir que a transação e a fila consolidem
    console.log('⏳ A aguardar consolidação no banco de dados...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const totalBookings = await prisma.booking.count({
      where: { slotId: slot.id },
    });

    const updatedSlot = await prisma.slot.findUnique({
      where: { id: slot.id },
    });

    console.log(`\n🔍 === AUDITORIA DA BASE DE DADOS ===`);
    console.log(`Agendamentos criados para o slot ${slot.id}: ${totalBookings}`);
    console.log(`Estado final do slot (isBooked): ${updatedSlot?.isBooked}`);

    if (totalBookings === 1 && updatedSlot?.isBooked === true) {
      console.log('\n✅ TESTE APROVADO! O Lock Distribuído impediu double-booking e garantiu exatamente 1 agendamento.');
    } else {
      console.log(`\n❌ FALHA! Encontrados ${totalBookings} agendamentos no banco.`);
    }
  } catch (error) {
    console.error('Erro durante o teste de estresse:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runStressTest();