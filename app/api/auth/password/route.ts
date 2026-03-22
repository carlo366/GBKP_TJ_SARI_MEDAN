import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword)
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
  if (newPassword.length < 6)
    return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash)))
    return NextResponse.json({ error: 'Password lama salah' }, { status: 401 });

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({ where: { id: session.id }, data: { passwordHash: hash } });

  return NextResponse.json({ ok: true });
}
