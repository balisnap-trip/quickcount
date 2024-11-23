import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '../../lib/generate-uuid'
import { sendMessage } from '../../lib/green-api/sendMessage'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { messageData, senderData } = await req.json()
  try {
    if(!messageData || !senderData){
      return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
    let message = ""
    if(messageData.typeMessage === "extendedTextMessage"){
      message = messageData.extendedTextMessageData.text
    } else if(messageData.typeMessage === "textMessage"){
      message = messageData.textMessageData.textMessage
    }
    const nikPattern = /\b(NIK\s*:\s*\d{16})\b/i.test(message)

    if(message.toLowerCase() === "token"){
      await checkToken(senderData)
    } else if(message.toLowerCase() === "info"){
      await hitungCepat(senderData)
    } else if(nikPattern){
      const nik = message.match(/\d{16}/)?.[0]
      console.log(nik)
      if(nik) { 
        await updateNIK(senderData, nik)
      }
    } else {
      return NextResponse.json("ok", { status: 200 })
    }

    return NextResponse.json("ok", { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

const checkToken = async (senderData: any) => {
  const saksi = await getSaksi(senderData)
  let message
  if(!saksi){
    message= "Anda tidak terdaftar pada sistem.\nHubungi admin untuk informasi lebih lanjut" 
  } else if(saksi.status_input){
    message = `Saksi: ${saksi.nama_saksi}\nAnda sudah melakukan input data.\nUntuk melakukan input data kembali, silahkan hubungi admin`
  } else {
    const token = generateToken()
    await prisma.saksi.update({
      where: {
        id_saksi: saksi.id_saksi
      },
      data: {
        token: token
      }
    })
 
    const url = `${process.env.NEXTAUTH_URL}/input-data/${token}`
    message = `Saksi: ${saksi.nama_saksi}\nBerikut adalah url untuk input data sistem quickcount: ${url}`
  }
 
  const messagePayload = {
    chatId: senderData.chatId,
    message
  }
  await sendMessage(messagePayload)
}

const hitungCepat = async (senderData: any) => {
  const saksi = await getSaksi(senderData)
  if(!saksi){
    return NextResponse.json({ error: 'Saksi tidak ditemukan' }, { status: 404 })
  }
  const perhitungan = await prisma.dataPerhitungan.aggregate({
    _sum: {
      suara_bupati_1: true,
      suara_bupati_2: true,
      suara_tidak_sah_bupati: true,      
    }
  })
  const totalDpt = await prisma.tPS.aggregate({
    _sum: {
      total_dpt: true
    }
  })
  const totalBupati = Number(perhitungan._sum.suara_bupati_1) + Number(perhitungan._sum.suara_bupati_2)
  const totalSuara = Number(perhitungan._sum.suara_bupati_1) + Number(perhitungan._sum.suara_bupati_2) + Number(perhitungan._sum.suara_tidak_sah_bupati)
  const presentse1 = ((Number(perhitungan._sum.suara_bupati_1) / totalBupati) * 100).toFixed(2) +'%'
  const presentse2 = ((Number(perhitungan._sum.suara_bupati_2) / totalBupati) * 100).toFixed(2) +'%'

  const message =`*Hasil terkini perhitungan suara*
  Paslon 1: ${perhitungan._sum.suara_bupati_1} - (${presentse1})
  Paslon 2: ${perhitungan._sum.suara_bupati_2} - (${presentse2})
  Tidak Sah: ${perhitungan._sum.suara_tidak_sah_bupati}
  Total DPT: ${totalDpt._sum.total_dpt}
  Total Suara Masuk: ${totalSuara} - (${(totalSuara/Number(totalDpt._sum.total_dpt) * 100).toFixed(2)}%)`

  await sendMessage({
    chatId: senderData.chatId,
    message
  })
}

const updateNIK = async (senderData: any, nik: string) => {
  const saksi = await getSaksi(senderData)
  if(!saksi){
    return NextResponse.json({ error: 'Saksi tidak ditemukan' }, { status: 404 })
  }
  try {
    await prisma.saksi.update({
      where: {
        id_saksi: saksi.id_saksi
      },
      data: {
        nik
      }
    })
    const message = `Saksi: ${saksi.nama_saksi}\nNIK anda berhasil diupdate.\nNIK anda: ${nik}`
    await sendMessage({
      chatId: senderData.chatId,
      message
    })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  }
}

const getWaNo = (chatId: any) => {
  return chatId.replace(/^62/,0).replace(/@c.us/,"")
}

const getSaksi = async (senderData: any) => {
  const {chatId} = senderData
  const waNo = getWaNo(chatId)
  const saksi = await prisma.saksi.findFirst({
    where: {
      nomor_wa: waNo
    }
  })
  return saksi
}