import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "../../../lib/input-data/file-upload";
import { PrismaClient } from "@prisma/client";
import { Group } from "@mantine/core";
import { kecamatan } from "../../../lib/masterData";

interface GroupedData {
  [kecamatan: string]: {
    suara_bupati_1: number;
    suara_bupati_2: number;
    suara_tidak_sah_bupati: number;
    persen_bupati_1?: string;
    persen_bupati_2?: string;
  };
}
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

    const dataPerhitungan = await prisma.dataPerhitungan.findMany({
      include: {
        tps: {
          select: {
            kecamatan: true, // hanya ambil kecamatan
          },
        },
      },
    });
  
    // Kelompokkan suara berdasarkan kecamatan
    const suaraPerKecamatan: GroupedData = dataPerhitungan.reduce((acc, item) => {
      const kecamatan = item.tps.kecamatan;
  
      // Jika kecamatan belum ada, inisialisasi dengan nilai default
      if (!acc[kecamatan]) {
        acc[kecamatan] = {
          suara_bupati_1: 0,
          suara_bupati_2: 0,
          suara_tidak_sah_bupati: 0,
        };
      }
  
      // Tambahkan suara ke kecamatan yang sesuai
      acc[kecamatan].suara_bupati_1 += item.suara_bupati_1;
      acc[kecamatan].suara_bupati_2 += item.suara_bupati_2;
      acc[kecamatan].suara_tidak_sah_bupati += item.suara_tidak_sah_bupati;
      return acc;
    }, {} as GroupedData); 


    const totalDPT = await prisma.tPS.aggregate({
      _sum: {
        total_dpt: true
      },
    });

    const lastUpdatedData = await prisma.dataPerhitungan.findFirst({
      orderBy: {
        tgl_input: 'desc'
      },
      select: {
        tgl_input: true
      }
    })

    const date = new Date(lastUpdatedData?.tgl_input as Date);
    const opt = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Makassar"
    };
    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Makassar"
    });
    
    const formattedDate = formatter.format(date)
    const totalSuaraPerKecamatan = hitungPersentaseSuara(suaraPerKecamatan);

    const totalSuaraBupatiValid = Number(totalSuara._sum.suara_bupati_1) + Number(totalSuara._sum.suara_bupati_2);

    const presentaseBupati = {
      presentaseBupati1: ((Number(totalSuara._sum.suara_bupati_1) / totalSuaraBupatiValid) * 100).toFixed(2) + '%',
      presentaseBupati2: ((Number(totalSuara._sum.suara_bupati_2) / totalSuaraBupatiValid) * 100).toFixed(2) + '%',
    } 

    const data = {...totalSuara._sum, ...totalDPT._sum, ...presentaseBupati, totalSuaraPerKecamatan, formattedDate};

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
};

function hitungPersentaseSuara(suaraPerKecamatan: GroupedData): GroupedData {
  const mappedSuaraPerKecamatan: GroupedData = {};

  // Iterasi setiap kecamatan
  kecamatan.forEach((item) => {
    const kecamatanName = item.kecamatan.trim().toUpperCase();
    const matchingKey = Object.keys(suaraPerKecamatan).find((key) => 
      key.replace(/^\d+\.\s*/, '').trim().toUpperCase() === kecamatanName
    );

    if (matchingKey) {
      // Jika kecamatan ditemukan, hitung persentase suara
      const data = suaraPerKecamatan[matchingKey];
      const totalSuaraSah = data.suara_bupati_1 + data.suara_bupati_2;
      const persenBupati1 = totalSuaraSah > 0 ? (data.suara_bupati_1 / totalSuaraSah) * 100 : 0;
      const persenBupati2 = totalSuaraSah > 0 ? (data.suara_bupati_2 / totalSuaraSah) * 100 : 0;

      mappedSuaraPerKecamatan[kecamatanName] = {
        ...data,
        persen_bupati_1: `${persenBupati1.toFixed(2)}%`,
        persen_bupati_2: `${persenBupati2.toFixed(2)}%`,
      };
    } else {
      // Jika kecamatan tidak ditemukan, tambahkan nilai default
      mappedSuaraPerKecamatan[kecamatanName] = {
        suara_bupati_1: 0,
        suara_bupati_2: 0,
        suara_tidak_sah_bupati: 0,
        persen_bupati_1: '0%',
        persen_bupati_2: '0%',
      };
    }
  });

  return mappedSuaraPerKecamatan;
}
