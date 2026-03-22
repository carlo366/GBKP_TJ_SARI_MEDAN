# GBKP Runggun Tanjung Sari — Website Resmi

Website resmi GBKP Runggun Tanjung Sari, Medan. Dibangun dengan Next.js 14, TypeScript, Prisma, dan PostgreSQL.

---

## Fitur

- Halaman publik: Beranda, Jadwal Ibadah, Warta (Momo), Kontak & Lokasi
- Arsip warta jemaat (Momo) dengan filter sesi dan bulan
- Upload file warta: PDF, Word (.doc/.docx), JPG, PNG
- Persembahan pujian dinamis (bisa lebih dari 1)
- Panel admin dengan autentikasi JWT
- Pengaturan situs dinamis: jam ibadah, alamat, logo, kontak, peta
- Ganti password admin
- Responsif untuk semua ukuran layar

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT dalam httpOnly cookie
- **Styling**: CSS Variables + inline styles

---

## Menjalankan Lokal

### 1. Clone repo

```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan nilai yang sesuai:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gbkp"
JWT_SECRET="string_acak_panjang_minimal_32_karakter"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admintjsari123"
```

### 4. Setup database

```bash
npm run db:push
npm run db:seed
```

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploy 

### Vercel + Neon 

### Railway

---

## Struktur Folder

```
├── app/
│   ├── admin/          # Halaman login & dashboard admin
│   ├── api/            # API routes (auth, momo, upload, config)
│   ├── globals.css     # Global styles
│   └── page.tsx        # Entry point halaman publik
├── components/
│   ├── pages/          # Beranda, Jadwal, Momo, Kontak
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── auth.ts         # JWT helper
│   ├── prisma.ts       # Prisma client
│   └── useSiteConfig.ts # Hook config dinamis
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed admin & config awal
└── public/
    └── uploads/        # File yang diupload (tidak di-push ke git)
```

---

## Kredensial Default

| Field    | Value            |
|----------|------------------|
| Username | `admin`          |
| Password | `admintjsari123` |

> Ganti password setelah login pertama melalui menu **Ganti Password** di dashboard.

---

## Lisensi

Dibuat untuk GBKP Runggun Tanjung Sari. Hak cipta dilindungi.
