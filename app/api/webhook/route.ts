import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { messageData, senderData } = await req.json()
  
  try {
    if(messageData &&  (messageData.typeMessage === "textMessage" || messageData.typeMessage === "textMessage")){
      const message = messageData.textMessageData.textMessage || messageData.extendedTextMessageData.text
      const isTokenRequest = message.toLowerCase() === "token"
      console.log(senderData.chatId)
    }
    return NextResponse.json("ok", { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
