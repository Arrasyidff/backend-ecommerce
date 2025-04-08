const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Mencoba menginisialisasi Prisma Client...');
  
  try {
    const prisma = new PrismaClient();
    console.log('✅ Berhasil menginisialisasi Prisma Client');
    
    console.log('Mencoba koneksi ke database...');
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Berhasil terhubung ke database:', result);
    
    await prisma.$disconnect();
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  }
}

main();