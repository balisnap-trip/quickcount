-- AlterTable
ALTER TABLE "Saksi" ALTER COLUMN "nomor_wa" DROP NOT NULL,
ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "status_input" SET DEFAULT false;
