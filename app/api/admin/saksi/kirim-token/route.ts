import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '../../../../lib/generate-uuid'
import { sendMessage } from '../../../../lib/green-api/sendMessage'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  
  try {
    let saksiList = []
    if(id != null){
       const saksi = await prisma.saksi.findFirst({
        where: {
          AND: [
            {
              id_saksi: id
            },
            {
              OR: [
                {
                  nomor_wa: {
                    not: ""
                  }
                },
                {
                  nomor_wa: {
                    not: null
                  }
                }
              ]
            }, {
              OR: [
                {
                  token: {
                    not: ""
                  }
                },
                {
                  token: {
                    not: null
                  }
                }
              ]
            }
          ]
        }
       })
       saksiList.push(saksi)
    } else {
      const saksi = await prisma.saksi.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  nomor_wa: {
                    not: ""
                  }
                }, {
                  nomor_wa: {
                    not: null
                  }
                }
              ]
            }, {
              OR: [
                {
                  token: {
                    not: ""
                  }
                },
                {
                  token: {
                    not: null
                  }
                }
              ]
            }
          ]
        }
      })
      saksiList.push(...saksi)
    }

    // Kirim token
    for(const item of saksiList){
      if(item){
        const token = generateToken()
        await prisma.saksi.update({
          where: {
            id_saksi: item.id_saksi
          },
          data: {
            token: token
          }
        })
     
        const url = `${process.env.NEXTAUTH_URL}/input-data/${token}`
        const message = `Saksi: ${item.nama_saksi}\nBerikut adalah url untuk input data sistem quickcount: ${url}`
    
        const chatId = item.nomor_wa?.replace(/^0/,'62') + '@c.us'
        const messagePayload = {
          chatId: chatId,
          message
        }
        await sendMessage(messagePayload)
      }
    }
    
    return NextResponse.json("ok", { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
