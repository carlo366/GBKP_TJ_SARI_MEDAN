'use client';
import type { Page } from '@/app/page';
import KaroDiv from '@/components/KaroDiv';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function Beranda({ setPage }: { setPage: (p: Page) => void }) {
  const { config } = useSiteConfig();
  const logo = config.logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png';

  return (
    <div className="page-enter">
      <div className="hero">
        <div className="side-karo left" /><div className="side-karo right" />
        <img className="hero-logo" src={logo} alt="GBKP Logo" width={120} height={120} />
        <div className="hero-badge"><i className="fa-solid fa-cross" />&nbsp;Gereja Batak Karo Protestan</div>
        <h1>GBKP Runggun<em>Tanjung Sari</em></h1>
        <div className="hero-verse">&ldquo;Ini aku, utuslah aku!&rdquo; &mdash; Yesaya 6:8</div>
        <p>Klasis Medan Kampung Lalang &middot; Melayani dengan kasih, bertumbuh dalam iman bersama seluruh jemaat di kota Medan.</p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={() => setPage('jadwal')}><i className="fa-solid fa-church" />Jadwal Ibadah</button>
          <button className="btn btn-outline" onClick={() => setPage('momo')}><i className="fa-solid fa-file-pdf" />Warta Minggu</button>
        </div>
      </div>

      <div className="info-strip">
        <div className="zig-down" style={{ background: 'var(--cream)' }} />
        <div className="istrip-inner">
          <div className="is-col"><div className="is-num">2&times;</div><div className="is-lbl">Ibadah per Minggu</div></div>
          <div className="is-col"><div className="is-num">GBKP</div><div className="is-lbl">Gereja Batak Karo Protestan</div></div>
          <div className="is-col"><div className="is-num">Medan</div><div className="is-lbl">Klasis Kampung Lalang</div></div>
        </div>
        <div className="zig-up" style={{ background: 'var(--cream)' }} />
      </div>

      <div className="section" style={{ background: 'var(--cream)' }}>
        <div className="sh"><h2>Tentang Runggun Kami</h2><p>Bersama bertumbuh dalam iman di Medan, Sumatera Utara</p><KaroDiv /></div>
        <div style={{ maxWidth: 760, margin: 'auto', textAlign: 'center' }}>
          <p style={{ fontSize: '.98rem', color: '#5a2020', lineHeight: 1.95, marginBottom: 18 }}>
            GBKP Runggun Tanjung Sari adalah bagian dari Gereja Batak Karo Protestan yang berdiri dengan semangat <em>Ersada Ukur Ersada Ate</em> &mdash; satu hati dan satu pikiran.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(192,20,10,.06)', border: '1px solid rgba(192,20,10,.14)', borderRadius: 14, padding: '16px 24px' }}>
            <p style={{ fontSize: '.9rem', color: 'var(--red-deep)', lineHeight: 1.85, fontStyle: 'italic' }}>&ldquo;Supaya kamu seia sekata dan tidak ada perpecahan di antara kamu, tetapi sebaliknya kamu erat bersatu dan sehati sepikir.&rdquo;</p>
            <p style={{ fontSize: '.79rem', color: 'var(--muted)', marginTop: 7, fontWeight: 700 }}>&mdash; 1 Korintus 1:10</p>
          </div>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--cream)', paddingTop: 16 }}>
        <div className="sh"><h2>Jadwal Ibadah Minggu</h2><p>Datanglah dan beribadah bersama kami</p><KaroDiv /></div>
        <div className="jadwal-grid">
          <div className="jcard">
            <div className="jcard-top red"><div className="jcard-icon"><i className="fa-solid fa-sun" /></div><h3>Ibadah Pagi</h3><div className="lang">{config.pagiBahasa}</div></div>
            <div className="jcard-body">
              <div className="trow"><div className="tday">HARI</div><span className="tlabel" style={{ flex: 1 }}>Setiap Minggu</span></div>
              <div className="trow"><div className="tday">MULAI</div><span className="tlabel">Pukul</span><span className="tval">{config.pagiMulai} WIB</span></div>
              <div className="trow"><div className="tday">SELESAI</div><span className="tlabel">Pukul</span><span className="tval">{config.pagiSelesai} WIB</span></div>
              <div className="trow"><div className="tday g">LOKASI</div><span className="tlabel" style={{ flex: 1 }}>Gedung Utama Gereja</span></div>
            </div>
          </div>
          <div className="jcard">
            <div className="jcard-top night"><div className="jcard-icon" style={{ background: 'rgba(155,63,200,.25)', borderColor: 'rgba(155,63,200,.35)' }}><i className="fa-solid fa-moon" /></div><h3>Ibadah Sore</h3><div className="lang">{config.soreBahasa}</div></div>
            <div className="jcard-body">
              <div className="trow"><div className="tday">HARI</div><span className="tlabel" style={{ flex: 1 }}>Setiap Minggu</span></div>
              <div className="trow"><div className="tday">MULAI</div><span className="tlabel">Pukul</span><span className="tval">{config.soreMulai} WIB</span></div>
              <div className="trow"><div className="tday">SELESAI</div><span className="tlabel">Pukul</span><span className="tval">{config.soreSelesai} WIB</span></div>
              <div className="trow"><div className="tday g">LOKASI</div><span className="tlabel" style={{ flex: 1 }}>Gedung Utama Gereja</span></div>
            </div>
          </div>
          <div className="jcard">
            <div className="jcard-top special"><div className="jcard-icon"><i className="fa-solid fa-calendar-star" /></div><h3>Kegiatan Khusus</h3><div className="lang">Sesuai pengumuman</div></div>
            <div className="jcard-body">
              <p style={{ fontSize: '.86rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 14 }}>Hari besar gerejawi, HUT Runggun, Konser Rohani, dan kegiatan khusus lainnya.</p>
              <div className="jnote"><i className="fa-solid fa-bullhorn" style={{ color: 'var(--gold)', marginRight: 5 }} />Cek <strong>Warta (Momo)</strong> tiap Minggu untuk jadwal terkini.</div>
              <button onClick={() => setPage('momo')} style={{ marginTop: 12, width: '100%', padding: 10, borderRadius: 9, border: '1.5px solid var(--red-deep)', background: 'transparent', color: 'var(--red-deep)', fontWeight: 700, fontSize: '.86rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                <i className="fa-solid fa-file-pdf" /> Buka Warta Minggu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--red-deep)', padding: '56px 20px' }}>
        <div className="sh white"><h2>Fasilitas Kami</h2><p>Kami menyediakan kenyamanan dalam beribadah</p><KaroDiv white /></div>
        <div className="fac-grid">
          {[['fa-square-parking','Parkir Luas'],['fa-wind','AC / Kipas'],['fa-wheelchair','Akses Difabel'],['fa-baby','Gedung KKR'],['fa-wifi','WiFi'],['fa-restroom','Toilet Bersih']].map(([icon, label]) => (
            <div key={label} className="fac-item"><i className={`fa-solid ${icon}`} /><p>{label}</p></div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--cream)', padding: '64px 20px 72px' }}>
        <div className="sh"><h2>Temukan Kami</h2><p>Kunjungi GBKP Runggun Tanjung Sari di Medan Selayang</p><KaroDiv /></div>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '4px solid var(--red-deep)', boxShadow: '0 16px 48px rgba(139,0,0,.25)' }}>
            <div style={{ background: 'var(--red-deep)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--gold)', fontSize: 16, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '.9rem' }}>GBKP Tanjung Sari</div>
                  <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.78rem', wordBreak: 'break-word' as const }}>{config.alamat}</div>
                </div>
              </div>
              <a href={config.mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(245,166,35,.2)', border: '1px solid rgba(245,166,35,.4)', color: 'var(--gold-2)', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: '.8rem', textDecoration: 'none', flexShrink: 0 }}>
                <i className="fa-solid fa-arrow-up-right-from-square" />Perbesar Peta
              </a>
            </div>
            <iframe src={config.mapsEmbed} width="100%" height="400" style={{ display: 'block', border: 'none' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Peta GBKP" />
          </div>
        </div>
      </div>
    </div>
  );
}
