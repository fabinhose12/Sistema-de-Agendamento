import fastify from 'fastify';
import { bookingRoutes } from './http/routes/bookingRoutes';

export const app = fastify();

app.register(bookingRoutes, { prefix: '/api' });