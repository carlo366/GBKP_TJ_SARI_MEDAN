'use client';
import type { Page } from '@/app/page';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const { config } = useSiteConfig();
  const logo = config.logoUrl || '/logo-gbkp.png';

  return (
    <footer>
      <div className="footer-grid">
        <div className="fg-brand">
          <img src={logo} alt="GBKP" onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png'; }} />
          <h3>GBKP Runggun Tanjung Sari</h3>
          <p>Klasis Medan Kampung Lalang<br />Gereja Batak Karo Protestan</p>
          <p className="fv">"Ini aku, utuslah aku!" — Yesaya 6:8</p>
        </div>
        <div className="fg-col">
          <h4>Navigasi</h4>
          <ul>
            {(['beranda','jadwal','organisasi','berita','keuangan'] as Page[]).map(p => (
              <li key={p}><a onClick={() => setPage(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</a></li>
            ))}
          </ul>
        </div>
        <div className="fg-col">
          <h4>Kategorial</h4>
          <ul>
            <li><a onClick={() => setPage('organisasi')}>🌿 Saitun</a></li>
            <li><a onClick={() => setPage('organisasi')}>💪 Mamre</a></li>
            <li><a onClick={() => setPage('organisasi')}>🎵 Moria</a></li>
            <li><a onClick={() => setPage('organisasi')}>✨ Permata</a></li>
            <li><a onClick={() => setPage('organisasi')}>🌱 Seraya</a></li>
          </ul>
        </div>
        <div className="fg-col">
          <h4>Kontak</h4>
          <ul>
            <li><a>Kec. Medan Selayang</a></li>
            {config.whatsapp && <li><a href={`tel:${config.whatsapp}`}>{config.whatsapp}</a></li>}
            {config.email && <li><a href={`mailto:${config.email}`}>{config.email}</a></li>}
            <li><a onClick={() => setPage('momo')}>Warta / Momo</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <p>© {new Date().getFullYear()} <strong>GBKP Runggun Tanjung Sari</strong> · Klasis Medan Kampung Lalang · Soli Deo Gloria</p>
      </div>
    </footer>
  );
}
