import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "../../../lib/input-data/file-upload";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const GET = async (req: NextRequest) => {
  try {
    const totalSuara = await prisma.dataPerhitungan.aggregate({
      _sum: {
        suara_bupati_1: true,
        suara_bupati_2: true,
        suara_gubernur_1: true,
        suara_gubernur_2: true,
        suara_tidak_sah_bupati: true,
        suara_tidak_sah_gubernur: true,
        // total_suara_masuk: true
      },
    });

    const totalDPT = await prisma.tPS.aggregate({
      _sum: {
        total_dpt: true
      },
    });

    const totalSuaraBupatiValid = Number(totalSuara._sum.suara_bupati_1) + Number(totalSuara._sum.suara_bupati_2);

    const presentaseBupati = {
      presentaseBupati1: ((Number(totalSuara._sum.suara_bupati_1) / totalSuaraBupatiValid) * 100).toFixed(2) + '%',
      presentaseBupati2: ((Number(totalSuara._sum.suara_bupati_2) / totalSuaraBupatiValid) * 100).toFixed(2) + '%',
    } 

    const data = {...totalSuara._sum, ...totalDPT._sum, ...presentaseBupati};

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
};