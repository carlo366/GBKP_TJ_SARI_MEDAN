import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kategori = searchParams.get('kategori');
  const level = searchParams.get('level');
  const sektor = searchParams.get('sektor');

  const where: Record<string, unknown> = {};
  if (kategori) where.kategori = kategori;
  if (level) where.level = level;
  if (sektor !== null) where.sektor = parseInt(sektor);

  const items = await prisma.anggotaOrg.findMany({
    where,
    orderBy: [{ urutan: 'asc' }, { id: 'asc' }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kategori, level, sektor, jabatan, nama, noWa, urutan } = body;

  const item = await prisma.anggotaOrg.create({
    data: {
      kategori,
      level,
      sektor: sektor ? parseInt(sektor) : null,
      jabatan,
      nama,
      noWa: noWa || null,
      urutan: urutan || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}