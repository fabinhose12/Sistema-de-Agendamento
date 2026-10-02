import { FastifyInstance } from 'fastify';
import { createBookingController } from '../controllers/bookingController';

export async function bookingRoutes(app: FastifyInstance) {
  app.post('/bookings', createBookingController);
}