import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '../../../../lib/generate-uuid'
import { sendMessage } from '../../../../lib/green-api/sendMessage'


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
      const update = await prisma.saksi.update({
        where: {
          id_saksi: saksi.id_saksi
        }, 
        data: {
          token: generateToken(),
          status_edit: false
        }
      })

      // Kirim ulang token
      const url = `${process.env.NEXTAUTH_URL}/input-data/edit/${update.token}`
        const message = `Saksi: ${update.nama_saksi}\nBerikut adalah url untuk perbaikan data sistem quickcount: ${url}`
    
        const chatId = update.nomor_wa?.replace(/^0/,'62') + '@c.us'
        const messagePayload = {
          chatId: chatId,
          message
        }

        console.log(messagePayload)
        await sendMessage(messagePayload)

      return NextResponse.json("ok", { status: 200 })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
