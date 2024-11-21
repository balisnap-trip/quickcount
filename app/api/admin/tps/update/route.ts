import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id, data } = await req.json()
  try {
    const tps = await prisma.tPS.update({
      where: {
        id_tps: id
      },
      data
    })
    if (!tps) {
      return NextResponse.json({ error: 'TPS tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(tps, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
