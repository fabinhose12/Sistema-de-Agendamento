const { app } = require('./app');

const PORT = Number(process.env.PORT) || 3000;

app
  .listen({
    host: '0.0.0.0',
    port: PORT,
  })
  .then(() => {
    console.log(`🚀 Servidor HTTP rodando na porta ${PORT}`);
  })
  .catch((err) => {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  });