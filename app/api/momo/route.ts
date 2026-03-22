import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sesi = searchParams.get('sesi');
  const bulan = searchParams.get('bulan'); // format: "2024-03"

  const where: Record<string, unknown> = {};
  if (sesi && ['pagi', 'sore'].includes(sesi)) where.sesi = sesi;
  if (bulan) {
    const [y, m] = bulan.split('-').map(Number);
    where.tanggal = {
      gte: new Date(y, m - 1, 1),
      lt: new Date(y, m, 1),
    };
  }

  const items = await prisma.momo.findMany({
    where,
    orderBy: [{ tanggal: 'desc' }, { sesi: 'asc' }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { tanggal, sesi, judul, pengkhotbah, ayatNas, persembahanPujian, fileUrl, fileName } = body;

  if (!tanggal || !sesi || !judul)
    return NextResponse.json({ error: 'Tanggal, sesi, dan judul wajib diisi' }, { status: 400 });

  const item = await prisma.momo.create({
    data: {
      tanggal: new Date(tanggal),
      sesi,
      judul,
      pengkhotbah: pengkhotbah || null,
      ayatNas: ayatNas || null,
      persembahanPujian: Array.isArray(persembahanPujian) && persembahanPujian.length > 0
        ? JSON.stringify(persembahanPujian.filter((s: string) => s.trim()))
        : null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
