const { PrismaClient } = require('@prisma/client');

// Patron singleton para evitar multiples instancias de PrismaClient
// (importante en desarrollo con nodemon / hot reload)
let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

prisma = global.__prisma;

module.exports = prisma;
