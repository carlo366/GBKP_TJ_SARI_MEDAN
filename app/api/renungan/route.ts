import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');

  const items = await prisma.renungan.findMany({
    orderBy: [{ tanggal: 'desc' }],
    take: limit ? parseInt(limit) : undefined,
  });

  // Return latest if no limit, otherwise return array
  if (!limit) {
    return NextResponse.json(items[0] || null);
  }
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tanggal, ayat, judul, isi, penulis, imgUrl } = body;

  const item = await prisma.renungan.create({
    data: {
      tanggal: tanggal ? new Date(tanggal) : new Date(),
      ayat,
      judul,
      isi,
      penulis,
      imgUrl: imgUrl || null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}