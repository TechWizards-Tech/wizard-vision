require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/utils/prisma');

const PORT = process.env.PORT || 3333;

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados conectado com sucesso');

    app.listen(PORT, () => {
      console.log(`\n🚀 WizardVision API rodando!`);
      console.log(`   📍 URL: http://localhost:${PORT}`);
      console.log(`   🏥 Health: http://localhost:${PORT}/health`);
      console.log(`   🌍 Ambiente: ${process.env.NODE_ENV}\n`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

start();
