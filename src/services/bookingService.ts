import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { acquireLock, releaseLock } from './lockService.js';

interface CreateBookingInput {
  userId: string;
  slotId: string;
}

export async function createBookingService({ userId, slotId }: CreateBookingInput) {
  const lockKey = `slot:${slotId}`;
  
  const hasLock = await acquireLock(lockKey, 3000);

  if (!hasLock) {
    const error = new Error('Este horário já está sendo processado por outro usuário.');
    (error as any).statusCode = 409;
    throw error;
  }

  try {
    const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
      });

      if (!slot) {
        const error = new Error('Horário não encontrado.');
        (error as any).statusCode = 404;
        throw error;
      }

      if (slot.isBooked) {
        const error = new Error('Este horário já foi agendado.');
        (error as any).statusCode = 400;
        throw error;
      }

      await tx.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return tx.booking.create({
        data: {
          userId,
          slotId,
        },
      });
    });

    return booking;
  } finally {
    await releaseLock(lockKey);
  }
}