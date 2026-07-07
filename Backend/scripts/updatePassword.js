// Script de uso unico: actualiza la contrasena del usuario administrador.
// No modifica pacientes, sesiones ni historial: solo la tabla "admins".
//
// Uso:
//   node scripts/updatePassword.js
//
// Por defecto cambia la contrasena a "recover2026" para todos los admins
// existentes (en este sistema hay un unico usuario de login).

require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const NUEVA_PASSWORD = 'recover2026';

async function main() {
  const passwordHash = await bcrypt.hash(NUEVA_PASSWORD, 10);

  const result = await prisma.admin.updateMany({
    data: { passwordHash },
  });

  if (result.count === 0) {
    console.log('No se encontro ningun usuario admin. No se realizo ningun cambio.');
  } else {
    console.log(`Contrasena actualizada correctamente para ${result.count} usuario(s).`);
    console.log(`Nueva contrasena: ${NUEVA_PASSWORD}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });