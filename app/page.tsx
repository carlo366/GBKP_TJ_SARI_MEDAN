'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Beranda from '@/components/pages/Beranda';
import Jadwal from '@/components/pages/Jadwal';
import Momo from '@/components/pages/Momo';
import Kontak from '@/components/pages/Kontak';

export type Page = 'beranda' | 'jadwal' | 'momo' | 'kontak';

export default function Home() {
  const [page, setPage] = useState<Page>('beranda');
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <>
      <div className="uis-band" />
      <Navbar page={page} setPage={go} />
      <main>
        {page === 'beranda' && <Beranda setPage={go} />}
        {page === 'jadwal' && <Jadwal setPage={go} />}
        {page === 'momo' && <Momo />}
        {page === 'kontak' && <Kontak />}
      </main>
      <Footer />
    </>
  );
}
