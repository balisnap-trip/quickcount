import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { uploadFile } from "../../../../lib/input-data/file-upload";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const fotoFormulirC1Bupati = body.buktiGambar instanceof File ? body.buktiGambar : null;
    // const fotoFormulirC1Gubernur = (body.fotoFormulirC1Gubernur as File) || null;

    const dataFileBupati = fotoFormulirC1Bupati ? await uploadFile(fotoFormulirC1Bupati) : null;
    // const dataFileGubernur = await uploadFile(fotoFormulirC1Gubernur);

    
      await prisma.dataPerhitungan.update({
        where: {
          id_perhitungan: Number(body.id_perhitungan),
        },
        data: {
          id_saksi: Number(body.idSaksi),
          id_tps: Number(body.idTps),
          suara_bupati_1: Number(body.suara_bupati_1),
          suara_bupati_2: Number(body.suara_bupati_2),
          suara_gubernur_1: 0,
          suara_gubernur_2: 0,
          suara_tidak_sah_bupati: Number(body.suara_tidak_sah_bupati),
          suara_tidak_sah_gubernur: 0,
          total_suara_masuk:0,
          tgl_input: new Date(),
        }
      })
      if (dataFileBupati) {
        await prisma.buktiGambar.update({
            where: {
              id_gambar: Number(body.id_gambar),
            },
            data: {
              id_perhitungan: Number(body.id_perhitungan),
              file_path: dataFileBupati?.url.publicUrl as string,
            },
          })        
      }
      await prisma.saksi.update({
        where: {
          id_saksi: Number(body.idSaksi),
        },
        data: {
          status_edit: true
        }
      })
    
    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
};