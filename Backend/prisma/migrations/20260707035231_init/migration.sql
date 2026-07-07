-- CreateEnum
CREATE TYPE "Operador" AS ENUM ('IGNACIO', 'JUAN');

-- CreateEnum
CREATE TYPE "EstadoPaciente" AS ENUM ('ACTIVO', 'INACTIVO', 'TRATAMIENTO_COMPLETADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoSesion" AS ENUM ('DESCUENTO', 'SUMA', 'RENOVACION');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "obraSocial" TEXT NOT NULL,
    "tipoLesion" TEXT NOT NULL,
    "sesionesAutorizadas" INTEGER NOT NULL DEFAULT 0,
    "sesionesRestantes" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoPaciente" NOT NULL DEFAULT 'ACTIVO',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_movements" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "tipo" "TipoMovimientoSesion" NOT NULL,
    "operador" "Operador" NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diaClave" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_logs" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operador" "Operador" NOT NULL,
    "patientId" TEXT,
    "pacienteNombre" TEXT,
    "accion" TEXT NOT NULL,
    "detalle" TEXT,

    CONSTRAINT "history_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE INDEX "patients_nombre_apellido_idx" ON "patients"("nombre", "apellido");

-- CreateIndex
CREATE INDEX "session_movements_patientId_diaClave_idx" ON "session_movements"("patientId", "diaClave");

-- CreateIndex
CREATE INDEX "history_logs_operador_idx" ON "history_logs"("operador");

-- CreateIndex
CREATE INDEX "history_logs_patientId_idx" ON "history_logs"("patientId");

-- CreateIndex
CREATE INDEX "history_logs_fecha_idx" ON "history_logs"("fecha");

-- AddForeignKey
ALTER TABLE "session_movements" ADD CONSTRAINT "session_movements_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_logs" ADD CONSTRAINT "history_logs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
