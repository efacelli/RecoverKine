-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('POR_SESION', 'PAGADO', 'IMPAGO');

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "estadoPago" "EstadoPago" NOT NULL DEFAULT 'POR_SESION';
