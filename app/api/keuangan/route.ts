import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bulan = searchParams.get('bulan');
  const limit = searchParams.get('limit');

  const where: Record<string, unknown> = {};
  if (bulan) {
    const [y, m] = bulan.split('-').map(Number);
    where.tanggal = {
      gte: new Date(y, m - 1, 1),
      lt: new Date(y, m, 1),
    };
  }

  const items = await prisma.keuangan.findMany({
    where,
    orderBy: [{ tanggal: 'desc' }],
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tanggal, tipe, keterangan, jumlah, kategori, catatan, buktiFoto } = body;

  const item = await prisma.keuangan.create({
    data: {
      tanggal: tanggal ? new Date(tanggal) : new Date(),
      tipe,
      keterangan,
      jumlah: parseFloat(jumlah),
      kategori: kategori || '',
      catatan: catatan || null,
      buktiFoto: buktiFoto || null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}