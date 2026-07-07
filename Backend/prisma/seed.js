require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log(`El usuario "${username}" ya existe. No se crea nuevamente.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: { username, passwordHash },
  });

  console.log(`Usuario administrador creado: ${username}`);
  console.log('Recuerda cambiar la contrasena por defecto en produccion.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
