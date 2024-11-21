import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const {page, perPage, filter} = await req.json()
  const skip = (Number(page) - 1) * Number(perPage)
  try {
    const tps = await prisma.tPS.findMany({
      skip,
      take: Number(perPage),
      where: {
        AND: [
          {
            ...(filter.query ? {
              OR: [
                {
                  nama_tps: {
                    contains: filter.query,
                    mode: 'insensitive',
                  },
                },
                {
                  lokasi: {
                    contains: filter.query,
                    mode: 'insensitive',
                  },
                },
                {
                  desa: {
                    contains: filter.query,
                    mode: 'insensitive',
                  },
                },
              ]
            } : {}),
          },
          {
            ...(filter.kec ? {
              kecamatan: {
                contains: filter.kec,
                mode: 'insensitive',
              },
            } : {}),
          }
        ]
      }
    });

    const totalCount = await prisma.tPS.count({
      where: {
        AND: [
          {
            ...(filter.query ? {
              OR: [
                {
                  nama_tps: {
                    contains: filter.query,
                    mode: 'insensitive',
                  },
                },
                {
                  lokasi: {
                    contains: filter.query,
                    mode: 'insensitive',
                  },
                },
                {
                  desa: {
                    contains: filter.query,
                    mode: 'insensitive',
                  },
                },
              ]
            } : {}),
          },
          {
            ...(filter.kec ? {
              kecamatan: {
                contains: filter.kec,
                mode: 'insensitive',
              },
            } : {}),
          }
        ]
      }
    })

    const totalPage = Math.ceil(totalCount / Number(perPage))

    const data = {
      tps,
      totalPage
    }
    if (!tps) {
      return NextResponse.json({ error: 'TPS tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
