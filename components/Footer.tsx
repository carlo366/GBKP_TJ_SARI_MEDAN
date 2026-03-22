'use client';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function Footer() {
  const { config } = useSiteConfig();
  const logo = config.logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png';

  return (
    <footer>
      <div className="footer-strip" />
      <div className="footer-inner">
        <div className="footer-logo">
          <img src={logo} alt="GBKP" width={44} height={44} />
          <span>GBKP Runggun Tanjung Sari</span>
        </div>
        <p className="footer-verse">&ldquo;Ini aku, utuslah aku!&rdquo; &mdash; Yesaya 6:8</p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} <strong>GBKP Runggun Tanjung Sari</strong> &middot; Klasis Medan Kampung Lalang
        </p>
      </div>
    </footer>
  );
}
