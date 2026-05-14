import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kategori = searchParams.get('kategori');
  const sektor = searchParams.get('sektor');
  const limit = searchParams.get('limit');

  const where: Record<string, unknown> = {};
  if (kategori) where.kategori = kategori;
  if (sektor !== null) where.sektor = parseInt(sektor);

  const items = await prisma.berita.findMany({
    where,
    orderBy: [{ tanggal: 'desc' }],
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kategori, sektor, judul, ringkasan, isi, penulis, lokasi, jam, imgUrl, tanggal } = body;

  const item = await prisma.berita.create({
    data: {
      kategori,
      sektor: sektor ? parseInt(sektor) : null,
      judul,
      ringkasan: ringkasan || null,
      isi,
      penulis,
      lokasi: lokasi || null,
      jam: jam || null,
      imgUrl: imgUrl || null,
      tanggal: tanggal ? new Date(tanggal) : new Date(),
    },
  });

  return NextResponse.json(item, { status: 201 });
}