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

    
    const totalSuaraPerKecamatan = hitungPersentaseSuara(suaraPerKecamatan);

    const totalSuaraBupatiValid = Number(totalSuara._sum.suara_bupati_1) + Number(totalSuara._sum.suara_bupati_2);

    const presentaseBupati = {
      presentaseBupati1: ((Number(totalSuara._sum.suara_bupati_1) / totalSuaraBupatiValid) * 100).toFixed(2) + '%',
      presentaseBupati2: ((Number(totalSuara._sum.suara_bupati_2) / totalSuaraBupatiValid) * 100).toFixed(2) + '%',
    } 

    console.log(totalSuaraPerKecamatan)
    const data = {...totalSuara._sum, ...totalDPT._sum, ...presentaseBupati, totalSuaraPerKecamatan};

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
};

function hitungPersentaseSuara(suaraPerKecamatan: GroupedData): GroupedData {
  const mappedSuaraPerKecamatan: GroupedData = {};

  // Iterasi untuk setiap kecamatan yang ada dalam daftar kecamatan
  kecamatan.forEach((item) => {
    const kecamatanName = item.kecamatan;
    const key = kecamatanName.trim().toUpperCase(); // Pastikan key sudah diproses

    // Iterasi untuk setiap key pada suaraPerKecamatan
    Object.keys(suaraPerKecamatan).forEach((kecamatanKey) => {
      // Proses key untuk menghapus angka dan titik seperti '7. PAYANGAN' menjadi 'PAYANGAN'
      const sanitizedKey = kecamatanKey.replace(/^\d+\.\s*/, '').toUpperCase();

      // Jika key yang sudah disanitasi cocok dengan nama kecamatan, maka hitung persentase
      if(sanitizedKey === key) {
        const data = suaraPerKecamatan[kecamatanKey]
         // Hitung total suara sah
         const totalSuaraSah = data.suara_bupati_1 + data.suara_bupati_2;

         // Menghindari pembagian dengan 0, dan pastikan persentase dihitung dengan benar
         const persenBupati1 = totalSuaraSah > 0 ? (data.suara_bupati_1 / totalSuaraSah) * 100 : 0;
         const persenBupati2 = totalSuaraSah > 0 ? (data.suara_bupati_2 / totalSuaraSah) * 100 : 0;
 
         // Menambahkan data beserta persentase ke dalam objek mappedSuaraPerKecamatan
         mappedSuaraPerKecamatan[key] = {
           ...data,
           persen_bupati_1: `${persenBupati1.toFixed(2)}%`,
           persen_bupati_2: `${persenBupati2.toFixed(2)}%`,
         };
      } else {
        mappedSuaraPerKecamatan[key] = {
          suara_bupati_1: 0,
          suara_bupati_2: 0,
          suara_tidak_sah_bupati: 0,
          persen_bupati_1: '0%',
          persen_bupati_2: '0%',
        };
      }
    });
  });

  return mappedSuaraPerKecamatan;
}
