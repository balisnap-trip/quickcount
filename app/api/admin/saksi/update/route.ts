import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id, data } = await req.json()
  try {
    const tps = await prisma.saksi.update({
      where: {
        id_saksi: id
      },
      data
    })
    if (!tps) {
      return NextResponse.json({ error: 'Saksi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(tps, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data saksi' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
