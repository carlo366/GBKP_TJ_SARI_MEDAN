'use client';
import KaroDiv from '@/components/KaroDiv';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function Kontak() {
  const { config } = useSiteConfig();

  return (
    <div className="page-enter">
      <div className="kontak-page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.4)', color: 'var(--gold-2)', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 16px', borderRadius: 999, marginBottom: 14, textTransform: 'uppercase' as const, position: 'relative', zIndex: 1 }}>
          <i className="fa-solid fa-location-dot" />&nbsp;Kontak & Lokasi
        </div>
        <h1>Hubungi Kami</h1>
        <p>Temukan dan kunjungi GBKP Runggun Tanjung Sari</p>
      </div>

      <div className="addr-hero">
        <div className="addr-card">
          <div className="addr-card-inner">
            <div className="addr-left">
              <h3><i className="fa-solid fa-church" style={{ color: 'var(--gold)' }} />GBKP Runggun Tanjung Sari</h3>
              <div className="addr-row">
                <div className="addr-icon"><i className="fa-solid fa-location-dot" /></div>
                <div>
                  <h4>Alamat</h4>
                  <p>{config.alamat}</p>
                </div>
              </div>
              {config.telepon && (
                <div className="addr-row">
                  <div className="addr-icon"><i className="fa-solid fa-phone" /></div>
                  <div>
                    <h4>Telepon</h4>
                    <a href={`tel:${config.telepon.replace(/\s/g, '')}`}>{config.telepon}</a>
                  </div>
                </div>
              )}
              {config.whatsapp && (
                <div className="addr-row">
                  <div className="addr-icon"><i className="fa-brands fa-whatsapp" /></div>
                  <div>
                    <h4>WhatsApp Sekretariat</h4>
                    <a href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">{config.whatsapp}</a>
                  </div>
                </div>
              )}
              {config.email && (
                <div className="addr-row">
                  <div className="addr-icon"><i className="fa-solid fa-envelope" /></div>
                  <div>
                    <h4>Email</h4>
                    <a href={`mailto:${config.email}`}>{config.email}</a>
                  </div>
                </div>
              )}
            </div>
            <div className="addr-right">
              <iframe
                src={config.mapsEmbed}
                title="Peta GBKP Tanjung Sari"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="addr-badge-strip">
            <div className="addr-badge"><i className="fa-solid fa-clock" />Sekretariat: Senin–Jumat, 08.00–15.00 WIB</div>
            <a href={config.mapsUrl} target="_blank" rel="noreferrer" className="btn-maps-gold">
              <i className="fa-solid fa-map-location-dot" />Buka di Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="fullmap-section" style={{ marginTop: 48 }}>
        <h3><i className="fa-solid fa-map" style={{ marginRight: 8 }} />Peta Lokasi</h3>
        <div className="fullmap-wrap">
          <iframe
            src={config.mapsEmbed}
            title="Peta Lengkap GBKP Tanjung Sari"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div style={{ background: 'var(--red-deep)', padding: '48px 20px 56px' }}>
        <div className="sh white"><h2>Jam Sekretariat</h2><p>Kami siap melayani di jam kerja</p><KaroDiv white /></div>
        <div className="jam-grid">
          {[
            { icon: 'fa-calendar-week', title: 'Senin – Jumat', time: '08.00 – 15.00 WIB' },
            { icon: 'fa-calendar-day', title: 'Sabtu', time: '08.00 – 12.00 WIB' },
            { icon: 'fa-church', title: 'Hari Minggu', time: 'Ibadah saja' },
            { icon: 'fa-calendar-xmark', title: 'Hari Libur', time: 'Tutup' },
          ].map(({ icon, title, time }) => (
            <div key={title} className="jam-card">
              <i className={`fa-solid ${icon}`} />
              <h4>{title}</h4>
              <p>{time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
