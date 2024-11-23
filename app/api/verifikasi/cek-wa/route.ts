import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  const {noWa} = await req.json()
  try {
    const saksi = await prisma.saksi.findFirst({
      where: {
        nomor_wa: noWa
      }
    })
    if(!saksi) {
      return NextResponse.json({error: "Saksi tidak ditemukan"}, {status: 404})
    }
    return NextResponse.json(saksi, {status: 200})
  } catch (error) {
    return NextResponse.json({error: "Gagal memuat data"}, {status: 500})
  } finally {
    await prisma.$disconnect()
  }
}