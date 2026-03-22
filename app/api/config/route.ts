import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - public
export async function GET() {
  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });

  if (!config) {
    config = await prisma.siteConfig.create({
      data: { id: 1 },
    });
  }

  return NextResponse.json(config);
}

// PUT - requires auth
export async function PUT(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    console.log("BODY CONFIG:", body); // 🔥 debug penting

    const allowed = [
      'pagiMulai','pagiSelesai','pagiBahasa',
      'soreMulai','soreSelesai','soreBahasa',
      'alamat','telepon','whatsapp','email',
      'mapsUrl','mapsEmbed','logoUrl',
    ];

    const data: Record<string, string> = {};

    for (const key of allowed) {
      if (body[key] && typeof body[key] === 'string') {
        data[key] = body[key];
      }
    }

    // ❗ kalau tidak ada data dikirim
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang dikirim' },
        { status: 400 }
      );
    }

    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return NextResponse.json(config);

  } catch (error) {
    console.error("CONFIG ERROR:", error);
    return NextResponse.json(
      { error: 'Gagal update config' },
      { status: 500 }
    );
  }
}