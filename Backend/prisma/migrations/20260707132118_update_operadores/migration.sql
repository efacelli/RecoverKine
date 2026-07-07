/*
  Warnings:

  - The values [JUAN] on the enum `Operador` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Operador_new" AS ENUM ('IGNACIO', 'MARIANO', 'TOBIAS');
ALTER TABLE "session_movements" ALTER COLUMN "operador" TYPE "Operador_new" USING ("operador"::text::"Operador_new");
ALTER TABLE "history_logs" ALTER COLUMN "operador" TYPE "Operador_new" USING ("operador"::text::"Operador_new");
ALTER TYPE "Operador" RENAME TO "Operador_old";
ALTER TYPE "Operador_new" RENAME TO "Operador";
DROP TYPE "Operador_old";
COMMIT;
