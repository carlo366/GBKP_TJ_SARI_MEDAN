export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password)
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });

  const token = signToken({ id: admin.id, username: admin.username });

  const res = NextResponse.json({ ok: true, username: admin.username });

  res.cookies.set('gbkp_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('gbkp_token');
  return res;
}