import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  const {page, perPage, filter} = await req.json()

  const skip = (Number(page) - 1) * Number(perPage);
  try {
    const andCondition = [{}]
    if(filter.kec) {
      andCondition.push({
        tps : {
          kecamatan : {
            contains: filter.kec,
            mode: 'insensitive',
          }
        }
      })
    } 

    if(filter.desa) {
      andCondition.push({
        tps : {
          desa : {
            contains: filter.desa,
            mode: 'insensitive',
          }
        }
      })
    }

    if(filter.namaSaksi) {
      andCondition.push({
        tps : {
          saksiTPS : {
            some : {
              saksi : {
                nama_saksi : {
                  contains: filter.namaSaksi,
                  mode: 'insensitive',
                }
              }
            }
          }
        }
      })
    }
    
    const perhitungan = await prisma.dataPerhitungan.findMany({
      skip,
      take: Number(perPage),
      include : {
        tps : true,
        saksi: true,
        buktiGambar: true
      },
      where : {
        AND : andCondition
      }

    })
    const totalCount = await prisma.dataPerhitungan.count({
      where: {
        AND: andCondition
      },
    })
    const totalPage = Math.ceil(totalCount / Number(perPage));

    const desa = await prisma.tPS.findMany({
      where: {
        ...(filter.kec && filter.kec !== "" 
          ? { kecamatan: { contains: filter.kec, mode: 'insensitive' } } 
          : {}), 
      },
      select: {
        desa: true, // Select only the `desa` field
      },
      distinct: ['desa'],
    })
   
    const data = {
      perhitungan,
      totalPage,
      desa
    }

    if (!data) {
      return NextResponse.json({ error: 'Saksi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal memuat data saksi' }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}