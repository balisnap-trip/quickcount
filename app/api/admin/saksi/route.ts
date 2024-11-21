import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {

  const {page, perPage, filter} = await req.json()
  const skip = (Number(page) - 1) * Number(perPage);

  try {
    const saksi = await prisma.saksi.findMany({
      skip,
      take: Number(perPage),
      where: {
        AND: [
          {
            saksiTPS: {
              some: {
                tps: {
                  ...(filter.kec && {
                    kecamatan: {
                      contains: filter.kec,
                      mode: 'insensitive',
                    },
                  }),
                },
              },
            },
          },
          {
            ...(filter.namaSaksi ? {
              nama_saksi: {
                contains: filter.namaSaksi, 
                mode: 'insensitive',
              },
            } : {}),
          }
        ]
      },
      include: {
        saksiTPS: {
          include: {
            tps: true
          }
        }
      }
    })

    const totalCount = await prisma.saksi.count({
      where: {
        AND: [
          {
            saksiTPS: {
              some: {
                tps: {
                  ...(filter.kec && {
                    kecamatan: {
                      contains: filter.kec,
                      mode: 'insensitive',
                    }
                  }),
                },
              },
            },
          },
          {
            ...(filter.namaSaksi ? {
              nama_saksi: {
                contains: filter.namaSaksi, 
                mode: 'insensitive',
              },
            } : {}),
          }
        ]
      },
    })

    const totalPage = Math.ceil(totalCount / Number(perPage));

    const data = {
      saksi,
      totalPage
    }

    if (!data) {
      return NextResponse.json({ error: 'Saksi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data saksi' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
