import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function GET() {
  try {
    const tps = await prisma.tPS.findMany()
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
