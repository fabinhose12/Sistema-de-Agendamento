import { Worker } from 'bullmq';

const connection = {
  host: 'localhost',
  port: 6379,
};

export const bookingWorker = new Worker(
  'booking-notifications',
  async (job) => {
    console.log(`✉️ [Worker] Processando e-mail para o job ${job.id}...`);
    console.log(`📄 Dados recebidos:`, job.data);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`✅ [Worker] E-mail de confirmação enviado com sucesso para Booking ID: ${job.data.bookingId}`);
  },
  { connection }
);

bookingWorker.on('failed', (job, err) => {
  console.error(`❌ [Worker] Falha ao processar job ${job?.id}:`, err);
});