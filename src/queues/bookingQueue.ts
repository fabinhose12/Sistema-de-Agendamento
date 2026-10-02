import { Queue } from 'bullmq';

const connection = {
  host: 'localhost',
  port: 6379,
};

export const bookingQueue = new Queue('booking-notifications', { connection });

export async function addBookingNotificationJob(data: { bookingId: string; userId: string }) {
  await bookingQueue.add('send-confirmation-email', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000, // Tenta novamente após 1s, 2s, 4s em caso de falha
    },
  });
}