import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  
  try {
    const user = await prisma.saksi.findFirst({
      where: {
        AND: [
          {
            token
          },
          {
            status_edit: false
          },
          {
            status_input: true
          }
        ]
      },
      include: {
        dataPerhitungan: {
          include: {
            buktiGambar: true
          }
        },
        saksiTPS: {
          include: {
            tps: true
          }
        }
      }
    })
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
