import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  console.log(id)
  try {
    const saksi = await prisma.saksi.delete({
      where: {
        id_saksi: id
      },
    })
    console.log(saksi)
    if (!saksi) {
      return NextResponse.json({ error: 'Saksi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(saksi, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
