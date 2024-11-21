import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '../../../../lib/generate-uuid'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { flag, id } = await req.json()
  try {
    if(id != null){
       await prisma.saksi.update({
        where: {
          id_saksi: id
        },
        data: {
          token: flag ? generateToken() : null
        }
       })
    } else {
      const saksi = await prisma.saksi.findMany({
        where: {
          nomor_wa: {
            not: null
          }
        }
      })

      for(const item of saksi){
        await prisma.saksi.update({
          where:{
            id_saksi: item.id_saksi
          },
          data: {
            token: flag ? generateToken() : null
          }
        })
      }
    }

    // Remove token untuk wa null
    await prisma.saksi.updateMany({
      where: {
        nomor_wa: null
      },
      data: {
        token: null
      }
    })

    const test = await prisma.saksi.updateMany({
      where: {
       OR: [
        {
          nomor_wa: {
            equals: ""
          }
        },
        {
          nomor_wa: {
            equals: null
          }
        }
       ]
      },
      data: {
        token: null
      }
    })
    console.log(test)
    return NextResponse.json("ok", { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
