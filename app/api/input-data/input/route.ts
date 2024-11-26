import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "../../../lib/input-data/file-upload";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const fotoFormulirC1Bupati = (body.fotoFormulirC1Bupati as File) || null;
    // const fotoFormulirC1Gubernur = (body.fotoFormulirC1Gubernur as File) || null;

    const dataFileBupati = await uploadFile(fotoFormulirC1Bupati);
    // const dataFileGubernur = await uploadFile(fotoFormulirC1Gubernur);

    if (dataFileBupati) {
      const dataPerhitungan = await prisma.dataPerhitungan.create({
        data: {
          id_saksi: Number(body.idSaksi),
          id_tps: Number(body.idTps),
          suara_bupati_1: Number(body.suaraBupati1),
          suara_bupati_2: Number(body.suaraBupati2),
          suara_gubernur_1: 0,
          suara_gubernur_2: 0,
          suara_tidak_sah_bupati: Number(body.suaraTidakSahBupati),
          suara_tidak_sah_gubernur: 0,
          total_suara_masuk:0,
          tgl_input: new Date(),
        }
      })
      if (dataPerhitungan) {
        await prisma.buktiGambar.createMany({
          data: [
            {
              id_perhitungan: dataPerhitungan.id_perhitungan,
              file_path: dataFileBupati?.url.publicUrl as string,
            },
            // {
            //   id_perhitungan: dataPerhitungan.id_perhitungan,
            //   file_path: dataFileGubernur?.url.publicUrl as string,
            // }
          ]
        })

        await prisma.saksi.update({
          where: {
            id_saksi: Number(body.idSaksi),
          },
          data: {            
            status_input: true
          }
        })
      }
    }
    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
};