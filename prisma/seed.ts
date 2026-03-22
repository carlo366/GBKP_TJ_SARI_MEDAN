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

  // Init site config with defaults
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.9!2d98.6245348!3d3.5426388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312f87a64539d7%3A0xcb68077110b05047!2sGBKP%20Tanjung%20Sari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
      mapsUrl: 'https://www.google.com/maps/place/GBKP+Tanjung+Sari/@3.5431815,98.6246419,19z',
      alamat: 'GJVF+3R3, Sempakata, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20133',
    },
    create: { id: 1 },
  });

  console.log(`Admin "${username}" siap.`);
}

main().finally(() => prisma.$disconnect());
