'use client';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function Jadwal() {
  const { config } = useSiteConfig();

  return (
    <div className="page-enter" style={{ background: 'var(--w)', minHeight: '100vh' }}>
      <div className="ph">
        <div className="ph-inner">
          <div className="ph-eyebrow">Informasi Kegiatan</div>
          <h1 className="ph-title">Jadwal Ibadah & Kegiatan</h1>
          <p className="ph-sub">Berikut adalah jadwal ibadah dan kegiatan rutin GBKP Runggun Tanjung Sari</p>
        </div>
      </div>

      <div className="wrap" style={{ padding: '40px 16px' }}>
        {/* Ibadah Pagi */}
        <div style={{ background: 'var(--w)', border: '1px solid var(--m4)', borderRadius: 8, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--fh)', color: 'var(--r)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-sun" style={{ color: 'var(--g3)' }} /> Ibadah Pagi
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--m)', marginBottom: 4 }}>Hari & Waktu</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Minggu, {config.pagiMulai} – {config.pagiSelesai} WIB</div>
            </div>
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--m)', marginBottom: 4 }}>Bahasa</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{config.pagiBahasa}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bp)', borderRadius: 6 }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--b2)', marginRight: 8 }} />
            Gedung Utama GBKP Tanjung Sari
          </div>
        </div>

        {/* Ibadah Sore/Malam */}
        <div style={{ background: 'var(--w)', border: '1px solid var(--m4)', borderRadius: 8, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--fh)', color: 'var(--b)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-moon" style={{ color: '#6366F1' }} /> Ibadah Malam
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--m)', marginBottom: 4 }}>Hari & Waktu</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Minggu, {config.malamMulai} – {config.malamSelesai} WIB</div>
            </div>
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--m)', marginBottom: 4 }}>Bahasa</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{config.malamBahasa || 'Bahasa Indonesia'}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bp)', borderRadius: 6 }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--b2)', marginRight: 8 }} />
            Gedung Utama GBKP Tanjung Sari
          </div>
        </div>

        {/* Jam Sekretariat */}
        <div style={{ background: 'var(--w)', border: '1px solid var(--m4)', borderRadius: 8, padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--fh)', color: 'var(--r)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-clock" /> Jam Sekretariat
          </h2>
          <div className="jam3">
            <div className="j3c">
              <i className="fa-solid fa-calendar-week" />
              <h4>Senin – Jumat</h4>
              <p>08.00 – 15.00 WIB</p>
            </div>
            <div className="j3c">
              <i className="fa-solid fa-calendar-day" />
              <h4>Sabtu</h4>
              <p>08.00 – 12.00 WIB</p>
            </div>
            <div className="j3c">
              <i className="fa-solid fa-church" />
              <h4>Hari Minggu</h4>
              <p>Ibadah saja</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}