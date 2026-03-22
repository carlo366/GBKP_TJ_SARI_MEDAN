'use client';
import { useState } from 'react';
import type { Page } from '@/app/page';
import { useSiteConfig } from '@/lib/useSiteConfig';

const links: { key: Page; label: string }[] = [
  { key: 'beranda', label: 'Beranda' },
  { key: 'jadwal', label: 'Jadwal Ibadah' },
  { key: 'momo', label: 'Warta / Momo' },
  { key: 'kontak', label: 'Kontak' },
];

export default function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const { config } = useSiteConfig();
  const logo = config.logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png';
  const go = (p: Page) => { setPage(p); setOpen(false); };

  return (
    <nav>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => go('beranda')}>
          <img src={logo} alt="GBKP" width={48} height={48} />
          <div className="nav-logo-text">
            <span className="t1">GBKP Runggun Tanjung Sari</span>
            <span className="t2">Klasis Medan Kampung Lalang</span>
          </div>
        </div>
        <div className="nav-links">
          {links.map((l) => (
            <button key={l.key} className={page === l.key ? 'active' : ''} onClick={() => go(l.key)}>
              {l.label}
            </button>
          ))}
        </div>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </div>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map((l) => (
          <button key={l.key} onClick={() => go(l.key)}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
}
