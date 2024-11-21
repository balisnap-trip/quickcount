import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '../../../../lib/generate-uuid'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  
  try {
    const saksi = await prisma.saksi.findFirst({
      where: {
        id_saksi: id
      }
    })
    if(saksi){
      await prisma.saksi.update({
        where: {
          id_saksi: saksi.id_saksi
        }, 
        data: {
          token: generateToken(),
          status_input: false
        }
      })

      // Kirim ulang token

      return NextResponse.json("ok", { status: 200 })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
