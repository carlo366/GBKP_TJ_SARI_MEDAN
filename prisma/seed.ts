import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admintjsari123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash: hash },
    create: { username, passwordHash: hash },
  });

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // Seed Majelis
  const majelisData = [
    { jabatan: 'Ketua', nama: 'Pdt. Mangaran Simamora', noWa: '081234567890' },
    { jabatan: 'Wakil Ketua', nama: 'Pdt. Hotbon Simamora, S.Th', noWa: '081234567891' },
    { jabatan: 'Sekretaris', nama: 'Viktor Sipayung', noWa: '081234567892' },
    { jabatan: 'Bendahara', nama: 'Ronal Siahaan', noWa: '081234567893' },
  ];

  for (const m of majelisData) {
    await prisma.anggotaOrg.create({
      data: {
        kategori: 'majelis',
        level: 'klasis',
        sektor: null,
        jabatan: m.jabatan,
        nama: m.nama,
        noWa: m.noWa,
        urutan: majelisData.indexOf(m),
      },
    });
  }

  // Seed Organisasi Sektor (Mamre, Saitun, dll)
  const orgData = [
    // Mamre Sektor 1
    { kategori: 'mamre', sektor: 1, jabatan: 'Ketua Sektor', nama: 'Tumpak Sihotang' },
    { kategori: 'mamre', sektor: 1, jabatan: 'Bendahara', nama: 'Ronal Manalu' },
    // Mamre Sektor 2
    { kategori: 'mamre', sektor: 2, jabatan: 'Ketua Sektor', nama: 'Johannes Simamora' },
    { kategori: 'mamre', sektor: 2, jabatan: 'Bendahara', nama: 'Samuel Sipayung' },
    // Saitun
    { kategori: 'saitun', sektor: null, jabatan: 'Ketua', nama: 'Ina Sihotang' },
    { kategori: 'saitun', sektor: null, jabatan: 'Wakil Ketua', nama: 'Lina Sigalingging' },
    // Moria
    { kategori: 'moria', sektor: null, jabatan: 'Ketua', nama: 'Hotbon Simamora' },
    // Permata
    { kategori: 'permata', sektor: null, jabatan: 'Ketua', nama: 'Debora Siahaan' },
    // Seraya
    { kategori: 'seraya', sektor: null, jabatan: 'Ketua', nama: 'Ronal Sihotang' },
  ];

  for (const o of orgData) {
    await prisma.anggotaOrg.create({
      data: {
        kategori: o.kategori,
        level: o.sektor ? 'sektor' : 'gereja',
        sektor: o.sektor,
        jabatan: o.jabatan,
        nama: o.nama,
        noWa: null,
      },
    });
  }

  // Seed Berita Sample
  const beritaData = [
    {
      kategori: 'umum',
      judul: 'GBKP Tanjung Sari Gelar Acara Natal 2025',
      ringkasan: 'Gereja mengadakan perayaan Natal dengan pujian dan khotbah.',
      isi: '<p>GBKP Runggun Tanjung Sari menggelar perayaan Natal pada tanggal 25 Desember 2025 dengan berbagai rangkaian acara.</p>',
      penulis: 'Admin',
      tanggal: new Date('2025-12-25'),
    },
    {
      kategori: 'mamre',
      sektor: 1,
      judul: 'Sektor 1 Mamre - Kegiatan Bulanan',
      ringkasan: 'Dokumentasi kegiatan Sektor 1 Mamre bulan ini.',
      isi: '<p>Kegiatan rutin Sektor 1 Mamre digelar dengan khidmat.</p>',
      penulis: 'Pdt. Mangaran',
      tanggal: new Date('2025-01-15'),
    },
  ];

  for (const b of beritaData) {
    await prisma.berita.create({ data: b });
  }

  // Seed Renungan Sample
  const renunganData = [
    {
      tanggal: new Date('2025-01-15'),
      ayat: 'Yohanes 3:16',
      judul: 'Kasih Allah yang Melampaui Paham',
      isi: '<p>Yesus memberitahukan kasih Allah yang besar bagi kita.</p>',
      penulis: 'Pdt. Mangaran Simamora',
    },
    {
      tanggal: new Date('2025-01-14'),
      ayat: 'Roma 5:8',
      judul: 'Dicintai yang Belum Kudiri',
      isi: '<p>Allah tidak menunggu kita bertobat dulu untuk mencintai kita.</p>',
      penulis: 'Pdt. Hotbon Simamora',
    },
  ];

  for (const r of renunganData) {
    await prisma.renungan.create({ data: r });
  }

  // Seed Keuangan Sample
  const keuanganData = [
    { tanggal: new Date('2025-01-15'), tipe: 'masuk', keterangan: 'Persembahan Jemaat', jumlah: 5000000, kategori: 'Persembahan' },
    { tanggal: new Date('2025-01-14'), tipe: 'keluar', keterangan: 'Pembayaran Listrik', jumlah: 500000, kategori: 'Operasional' },
    { tanggal: new Date('2025-01-10'), tipe: 'masuk', keterangan: 'SPP Anak-Anak', jumlah: 1500000, kategori: 'SPP' },
  ];

  for (const k of keuanganData) {
    await prisma.keuangan.create({ data: k });
  }

  console.log('Seed data berhasil dibuat.');
}

main().finally(() => prisma.$disconnect());