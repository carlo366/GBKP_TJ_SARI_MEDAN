export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const session = getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop(); // 🔥 ambil extension asli

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // 🔥 semua file selain image pakai raw
          folder: 'momo',
          public_id: file.name.replace(/\.[^/.]+$/, ''),
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 🔥 gunakan extension asli
    const fileUrl = `${result.secure_url}.${ext}`;

    return NextResponse.json({
      fileUrl,
      fileName: file.name,
    });

  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }
}