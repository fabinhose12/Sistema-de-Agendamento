import type { FastifyRequest, FastifyReply } from 'fastify';
import { createBookingService } from '../../services/bookingService.js';

interface CreateBookingBody {
  userId: string;
  slotId: string;
}

export async function createBookingController(
  request: FastifyRequest<{ Body: CreateBookingBody }>,
  reply: FastifyReply
) {
  const { userId, slotId } = request.body;

  if (!userId || !slotId) {
    return reply.status(400).send({ message: 'userId e slotId são obrigatórios.' });
  }

  try {
    const booking = await createBookingService({ userId, slotId });
    return reply.status(201).send(booking);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({ message: error.message || 'Erro interno do servidor.' });
  }
}