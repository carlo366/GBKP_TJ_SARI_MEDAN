export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// ✅ GET - public
export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: 1 },
    });

    if (!config) {
      config = await prisma.siteConfig.create({
        data: { id: 1 },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("GET CONFIG ERROR:", error);
    return NextResponse.json(
      { error: 'Gagal mengambil config' },
      { status: 500 }
    );
  }
}

// ✅ PUT - requires auth
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();

    console.log("SESSION CONFIG:", session);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    console.log("BODY CONFIG:", body);

    const allowed = [
      'pagiMulai', 'pagiSelesai', 'pagiBahasa',
      'soreMulai', 'soreSelesai', 'soreBahasa',
      'alamat', 'telepon', 'whatsapp', 'email',
      'mapsUrl', 'mapsEmbed', 'logoUrl',
    ];

    const data: Record<string, string> = {};

    for (const key of allowed) {
      if (body[key] !== undefined && typeof body[key] === 'string') {
        data[key] = body[key];
      }
    }

    // ❗ kalau kosong
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