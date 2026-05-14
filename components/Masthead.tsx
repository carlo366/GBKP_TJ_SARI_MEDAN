'use client';
import { useState } from 'react';
import type { Page } from '@/app/page';
import { useSiteConfig } from '@/lib/useSiteConfig';

const NAV: { key: Page; label: string }[] = [
  { key: 'beranda', label: 'Beranda' },
  { key: 'jadwal', label: 'Jadwal' },
  { key: 'organisasi', label: 'Organisasi' },
  { key: 'berita', label: 'Berita' },
  { key: 'renungan', label: 'Renungan' },
  { key: 'keuangan', label: 'Keuangan' },
  { key: 'momo', label: 'Warta' },
  { key: 'kontak', label: 'Kontak' },
];

const MOB_ICONS: Record<Page, string> = {
  beranda: '🏠', jadwal: '⛪', organisasi: '🏛', berita: '📰',
  renungan: '📖', keuangan: '💰', momo: '📄', kontak: '📍',
};

export default function Masthead({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const { config } = useSiteConfig();
  const logo = config.logoUrl || '/logo-gbkp.png';

  const go = (p: Page) => { setPage(p); setOpen(false); };

  return (
    <>
      <div className="masthead">
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, zIndex: 1 }} className="ulos-band" />
        <div className="mh-top">
          <div className="mh-brand" onClick={() => go('beranda')}>
            <img className="mh-logo" src={logo} alt="GBKP" onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png'; }} />
            <div className="mh-name">
              <span className="n1">GBKP Tanjung Sari</span>
              <span className="n2">Portal Informasi Jemaat</span>
            </div>
          </div>
          <div className="mh-sep" />
          <div className="mh-nav">
            {NAV.map(n => (
              <button key={n.key} className={`mh-btn${page === n.key ? ' on' : ''}`} onClick={() => go(n.key)}>
                {n.label}
              </button>
            ))}
          </div>
          <button className="mh-hbg" onClick={() => setOpen(o => !o)}>
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
        <div className={`mh-mob${open ? ' show' : ''}`}>
          {NAV.map(n => (
            <a key={n.key} onClick={() => go(n.key)}>
              {MOB_ICONS[n.key]} {n.label}
            </a>
          ))}
        </div>
      </div>
      <div className="ulos-band" />
      <div className="ulos-zigzag" />
      <div className="ticker">
        <div className="ticker-lbl"><i className="fa-solid fa-bolt" style={{ marginRight: 4, fontSize: '.75rem' }} />INFO</div>
        <div className="ticker-wrap">
          <div className="ticker-track">
            <span>⛪ Ibadah Minggu Pagi: {config.pagiMulai} – {config.pagiSelesai} WIB · Gedung Utama</span>
            <span>🌙 Ibadah Minggu Malam: {config.malamMulai} – {config.malamSelesai} WIB · Bahasa Indonesia</span>
            <span>✨ HUT Runggun Tanjung Sari: 12 April 2026 — Selamat Ulang Tahun!</span>
            <span>📖 Renungan harian tersedia — Klik menu Renungan</span>
            <span>📄 Warta Minggu tersedia — Klik menu Warta</span>
          </div>
        </div>
      </div>
      <div className="ulos-zigzag inv" />
      <div className="ulos-border" />
    </>
  );
}
