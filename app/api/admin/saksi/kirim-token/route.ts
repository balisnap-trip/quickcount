import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '../../../../lib/generate-uuid'


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
    
    return NextResponse.json("ok", { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
