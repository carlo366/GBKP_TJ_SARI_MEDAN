'use client';
import type { Page } from '@/app/page';
import KaroDiv from '@/components/KaroDiv';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function Jadwal({ setPage }: { setPage: (p: Page) => void }) {
  const { config } = useSiteConfig();

  return (
    <div className="page-enter">
      <div className="momo-page-header">
        <div className="badge"><i className="fa-solid fa-church" />&nbsp;Jadwal Ibadah</div>
        <h1>Jadwal Ibadah</h1>
        <p>GBKP Runggun Tanjung Sari &mdash; Setiap Minggu</p>
      </div>

      <div className="section" style={{ background: 'var(--cream)' }}>
        <div className="sh"><h2>Ibadah Minggu</h2><p>Hadir dan beribadah bersama kami setiap hari Minggu</p><KaroDiv /></div>
        <div className="jadwal-grid">
          <div className="jcard">
            <div className="jcard-top red">
              <div className="jcard-icon"><i className="fa-solid fa-sun" /></div>
              <h3>Ibadah Pagi</h3>
              <div className="lang">{config.pagiBahasa}</div>
            </div>
            <div className="jcard-body">
              <div className="trow"><div className="tday">HARI</div><span className="tlabel" style={{ flex: 1 }}>Setiap Minggu</span></div>
              <div className="trow"><div className="tday">MULAI</div><span className="tlabel">Pukul</span><span className="tval">{config.pagiMulai} WIB</span></div>
              <div className="trow"><div className="tday">SELESAI</div><span className="tlabel">Pukul</span><span className="tval">{config.pagiSelesai} WIB</span></div>
              <div className="trow"><div className="tday g">LOKASI</div><span className="tlabel" style={{ flex: 1 }}>Gedung Utama Gereja</span></div>
              <div className="jnote"><i className="fa-solid fa-info-circle" style={{ color: 'var(--gold)', marginRight: 5 }} />Ibadah dalam bahasa Karo dan Indonesia. Semua jemaat dipersilakan hadir.</div>
            </div>
          </div>

          <div className="jcard">
            <div className="jcard-top night">
              <div className="jcard-icon" style={{ background: 'rgba(155,63,200,.25)', borderColor: 'rgba(155,63,200,.35)' }}><i className="fa-solid fa-moon" /></div>
              <h3>Ibadah Sore</h3>
              <div className="lang">{config.soreBahasa}</div>
            </div>
            <div className="jcard-body">
              <div className="trow"><div className="tday">HARI</div><span className="tlabel" style={{ flex: 1 }}>Setiap Minggu</span></div>
              <div className="trow"><div className="tday">MULAI</div><span className="tlabel">Pukul</span><span className="tval">{config.soreMulai} WIB</span></div>
              <div className="trow"><div className="tday">SELESAI</div><span className="tlabel">Pukul</span><span className="tval">{config.soreSelesai} WIB</span></div>
              <div className="trow"><div className="tday g">LOKASI</div><span className="tlabel" style={{ flex: 1 }}>Gedung Utama Gereja</span></div>
              <div className="jnote"><i className="fa-solid fa-info-circle" style={{ color: 'var(--gold)', marginRight: 5 }} />Ibadah sore dalam bahasa Indonesia. Cocok untuk keluarga muda.</div>
            </div>
          </div>

          <div className="jcard">
            <div className="jcard-top special">
              <div className="jcard-icon"><i className="fa-solid fa-calendar-star" /></div>
              <h3>Kegiatan Khusus</h3>
              <div className="lang">Sesuai pengumuman</div>
            </div>
            <div className="jcard-body">
              <p style={{ fontSize: '.86rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 14 }}>Hari besar gerejawi, HUT Runggun, Konser Rohani, Paskah, Natal, dan kegiatan khusus lainnya.</p>
              <div className="jnote"><i className="fa-solid fa-bullhorn" style={{ color: 'var(--gold)', marginRight: 5 }} />Cek <strong>Warta (Momo)</strong> tiap Minggu untuk jadwal terkini.</div>
              <button onClick={() => setPage('momo')} style={{ marginTop: 12, width: '100%', padding: 10, borderRadius: 9, border: '1.5px solid var(--red-deep)', background: 'transparent', color: 'var(--red-deep)', fontWeight: 700, fontSize: '.86rem', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                <i className="fa-solid fa-file-pdf" /> Buka Warta Minggu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--red-deep)', padding: '56px 20px' }}>
        <div className="sh white"><h2>Ibadah Kategorial</h2><p>Persekutuan khusus untuk setiap kelompok jemaat</p><KaroDiv white /></div>
        <div className="jadwal-grid">
          {[
            { icon: 'fa-child', title: 'Sekolah Minggu', time: 'Minggu, 08.00 WIB', desc: 'Ibadah anak-anak bersamaan dengan ibadah pagi', color: '#F5A623' },
            { icon: 'fa-users', title: 'Pemuda (PERMATA)', time: 'Sabtu, 17.00 WIB', desc: 'Persekutuan pemuda GBKP setiap Sabtu sore', color: '#9B3FC8' },
            { icon: 'fa-female', title: 'Moria (Ibu-Ibu)', time: 'Rabu, 15.00 WIB', desc: 'Persekutuan kaum ibu setiap Rabu siang', color: '#FF2D6E' },
            { icon: 'fa-male', title: 'Mamre (Bapak-Bapak)', time: 'Jumat, 19.00 WIB', desc: 'Persekutuan kaum bapak setiap Jumat malam', color: '#E8620A' },
          ].map(({ icon, title, time, desc, color }) => (
            <div key={title} className="jcard">
              <div className="jcard-top red" style={{ background: `linear-gradient(135deg, var(--dark), var(--red-deep))` }}>
                <div className="jcard-icon" style={{ color }}><i className={`fa-solid ${icon}`} /></div>
                <h3>{title}</h3>
                <div className="lang">{time}</div>
              </div>
              <div className="jcard-body">
                <p style={{ fontSize: '.86rem', color: 'var(--muted)', lineHeight: 1.75 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
