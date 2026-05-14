'use client';
import { useState, useEffect } from 'react';
import Masthead from '@/components/Masthead';
import Footer from '@/components/Footer';
import Beranda from '@/components/pages/Beranda';
import Jadwal from '@/components/pages/Jadwal';
import Organisasi from '@/components/pages/Organisasi';
import Berita from '@/components/pages/Berita';
import Renungan from '@/components/pages/Renungan';
import Keuangan from '@/components/pages/Keuangan';
import Momo from '@/components/pages/Momo';
import Kontak from '@/components/pages/Kontak';

export type Page =
  | 'beranda'
  | 'jadwal'
  | 'organisasi'
  | 'berita'
  | 'renungan'
  | 'keuangan'
  | 'momo'
  | 'kontak';

export default function Home() {
  const [page, setPage] = useState<Page>('beranda');
  const [showTop, setShowTop] = useState(false);

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Masthead page={page} setPage={go} />
      <main>
        <div className={page === 'beranda' ? 'page on' : 'page'}><Beranda setPage={go} /></div>
        <div className={page === 'jadwal' ? 'page on' : 'page'}><Jadwal setPage={go} /></div>
        <div className={page === 'organisasi' ? 'page on' : 'page'}><Organisasi /></div>
        <div className={page === 'berita' ? 'page on' : 'page'}><Berita /></div>
        <div className={page === 'renungan' ? 'page on' : 'page'}><Renungan /></div>
        <div className={page === 'keuangan' ? 'page on' : 'page'}><Keuangan /></div>
        <div className={page === 'momo' ? 'page on' : 'page'}><Momo /></div>
        <div className={page === 'kontak' ? 'page on' : 'page'}><Kontak /></div>
      </main>
      <Footer setPage={go} />
      {showTop && (
        <button
          className="back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Kembali ke atas"
        >
          <i className="fa-solid fa-chevron-up" />
        </button>
      )}
    </>
  );
}
