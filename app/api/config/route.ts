import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - public, no auth needed
export async function GET() {
  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: 1 } });
  }
  return NextResponse.json(config);
}

// PUT - requires auth
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const allowed = [
    'pagiMulai','pagiSelesai','pagiBahasa',
    'soreMulai','soreSelesai','soreBahasa',
    'alamat','telepon','whatsapp','email','mapsUrl','mapsEmbed','logoUrl',
  ];
  const data: Record<string, string> = {};
  for (const key of allowed) {
    if (typeof body[key] === 'string') data[key] = body[key];
  }

  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return NextResponse.json(config);
}
