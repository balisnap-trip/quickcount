-- CreateTable
CREATE TABLE "TPS" (
    "id_tps" SERIAL NOT NULL,
    "nama_tps" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "total_dpt" INTEGER NOT NULL,

    CONSTRAINT "TPS_pkey" PRIMARY KEY ("id_tps")
);

-- CreateTable
CREATE TABLE "Saksi" (
    "id_saksi" SERIAL NOT NULL,
    "nama_saksi" TEXT NOT NULL,
    "nomor_wa" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status_input" BOOLEAN NOT NULL,

    CONSTRAINT "Saksi_pkey" PRIMARY KEY ("id_saksi")
);

-- CreateTable
CREATE TABLE "DataPerhitungan" (
    "id_perhitungan" SERIAL NOT NULL,
    "id_saksi" INTEGER NOT NULL,
    "id_tps" INTEGER NOT NULL,
    "suara_bupati_1" INTEGER NOT NULL,
    "suara_bupati_2" INTEGER NOT NULL,
    "suara_gubernur_1" INTEGER NOT NULL,
    "suara_gubernur_2" INTEGER NOT NULL,
    "suara_tidak_sah_bupati" INTEGER NOT NULL,
    "suara_tidak_sah_gubernur" INTEGER NOT NULL,
    "tgl_input" TIMESTAMP(3) NOT NULL,
    "total_suara_masuk" INTEGER NOT NULL,

    CONSTRAINT "DataPerhitungan_pkey" PRIMARY KEY ("id_perhitungan")
);

-- CreateTable
CREATE TABLE "BuktiGambar" (
    "id_gambar" SERIAL NOT NULL,
    "id_perhitungan" INTEGER NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "BuktiGambar_pkey" PRIMARY KEY ("id_gambar")
);

-- CreateTable
CREATE TABLE "Saksi_TPS" (
    "id_saksi" INTEGER NOT NULL,
    "id_tps" INTEGER NOT NULL,
    "status_input" BOOLEAN NOT NULL,

    CONSTRAINT "Saksi_TPS_pkey" PRIMARY KEY ("id_saksi","id_tps")
);

-- AddForeignKey
ALTER TABLE "DataPerhitungan" ADD CONSTRAINT "DataPerhitungan_id_saksi_fkey" FOREIGN KEY ("id_saksi") REFERENCES "Saksi"("id_saksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPerhitungan" ADD CONSTRAINT "DataPerhitungan_id_tps_fkey" FOREIGN KEY ("id_tps") REFERENCES "TPS"("id_tps") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuktiGambar" ADD CONSTRAINT "BuktiGambar_id_perhitungan_fkey" FOREIGN KEY ("id_perhitungan") REFERENCES "DataPerhitungan"("id_perhitungan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saksi_TPS" ADD CONSTRAINT "Saksi_TPS_id_saksi_fkey" FOREIGN KEY ("id_saksi") REFERENCES "Saksi"("id_saksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saksi_TPS" ADD CONSTRAINT "Saksi_TPS_id_tps_fkey" FOREIGN KEY ("id_tps") REFERENCES "TPS"("id_tps") ON DELETE RESTRICT ON UPDATE CASCADE;
