-- DropForeignKey
ALTER TABLE "DataPerhitungan" DROP CONSTRAINT "DataPerhitungan_id_saksi_fkey";

-- DropForeignKey
ALTER TABLE "DataPerhitungan" DROP CONSTRAINT "DataPerhitungan_id_tps_fkey";

-- DropForeignKey
ALTER TABLE "Saksi_TPS" DROP CONSTRAINT "Saksi_TPS_id_saksi_fkey";

-- DropForeignKey
ALTER TABLE "Saksi_TPS" DROP CONSTRAINT "Saksi_TPS_id_tps_fkey";

-- AddForeignKey
ALTER TABLE "DataPerhitungan" ADD CONSTRAINT "DataPerhitungan_id_saksi_fkey" FOREIGN KEY ("id_saksi") REFERENCES "Saksi"("id_saksi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerhitungan" ADD CONSTRAINT "DataPerhitungan_id_tps_fkey" FOREIGN KEY ("id_tps") REFERENCES "TPS"("id_tps") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saksi_TPS" ADD CONSTRAINT "Saksi_TPS_id_saksi_fkey" FOREIGN KEY ("id_saksi") REFERENCES "Saksi"("id_saksi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saksi_TPS" ADD CONSTRAINT "Saksi_TPS_id_tps_fkey" FOREIGN KEY ("id_tps") REFERENCES "TPS"("id_tps") ON DELETE CASCADE ON UPDATE CASCADE;
