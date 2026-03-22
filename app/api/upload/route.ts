import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { getSession } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

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

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'momo',
          type: 'upload',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 🔥 FIX DI SINI
    let fileUrl = result.secure_url;

    // kalau PDF → pakai raw
    if (file.type === 'application/pdf') {
      fileUrl = fileUrl.replace('/image/upload/', '/raw/upload/');
    }

    return NextResponse.json({
      fileUrl,
      fileName: file.name,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }
}