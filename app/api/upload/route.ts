import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase();
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  if (!allowed.includes(ext))
    return NextResponse.json({ error: 'Hanya PDF, Word, JPG, PNG yang diizinkan' }, { status: 400 });

  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json({ error: 'File maksimal 10MB' }, { status: 400 });

  const filename = `momo_${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    fileUrl: `/uploads/${filename}`,
    fileName: file.name,
  });
}
