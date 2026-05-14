'use client';
import { useEffect, useState } from 'react';
import type { Page } from '@/app/page';

interface Berita {
  id: number;
  kategori: string;
  sektor: number | null;
  judul: string;
  ringkasan: string | null;
  imgUrl: string | null;
  tanggal: string;
}

interface Renungan {
  id: number;
  tanggal: string;
  ayat: string;
  judul: string;
  isi: string;
  penulis: string;
  imgUrl: string | null;
}

interface Keuangan {
  id: number;
  tanggal: string;
  tipe: string;
  keterangan: string;
  jumlah: number;
}

export default function Beranda({ setPage }: { setPage: (p: Page) => void }) {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [renungan, setRenungan] = useState<Renungan | null>(null);
  const [keuangan, setKeuangan] = useState<Keuangan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/berita?limit=6').then(r => r.json()),
      fetch('/api/renungan/latest').then(r => r.json()),
      fetch('/api/keuangan?limit=5').then(r => r.json()),
    ]).then(([b, r, k]) => {
      setBerita(Array.isArray(b) ? b : []);
      setRenungan(r || null);
      setKeuangan(Array.isArray(k) ? k : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  return (
    <>
      {/* HERO CAROUSEL SECTION */}
      <section className="photo-carousel-section">
        <div className="pc-bg">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="pc-bg-cell">
              <img src={`/hero-${i}.jpg`} alt={`Hero ${i}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ))}
        </div>
        <div className="pc-bg-overlay" />
        <div className="pc-content">
          <div className="pc-left">
            <h2>GBKP Runggun Tanjung Sari<br /><span>Portal Informasi Jemaat</span></h2>
            <p>Website resmi GBKP Runggun Tanjung Sari - Medan. Informasi ibadah, warta, renungan, dan kegiatan jemaat.</p>
            <div className="verse-box">
              "Aku mengumpulkan kamu di sini sebagai warga yang rela menjalani kehidupan yang sama."
              <div className="verse-ref">Roma 12:5</div>
            </div>
            <div className="pc-btns">
              <button className="pc-btn-gold" onClick={() => setPage('jadwal')}>
                <i className="fa-solid fa-calendar-days" /> Jadwal Ibadah
              </button>
              <button className="pc-btn-outline" onClick={() => setPage('kontak')}>
                <i className="fa-solid fa-location-dot" /> Lokasi Gereja
              </button>
            </div>
          </div>
          <div className="pc-right">
            <div className="pc-stat-card">
              <div className="psn">25+</div>
              <div className="psl">Tahun Berdiak</div>
            </div>
            <div className="pc-stat-card">
              <div className="psn">500+</div>
              <div className="psl">Jemaat</div>
            </div>
            <div className="pc-stat-card">
              <div className="psn">8</div>
              <div className="psl">Sektor</div>
            </div>
            <div className="pc-stat-card">
              <div className="psn">24</div>
              <div className="psl">Tim Pengurus</div>
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL STRIP */}
      <div className="carousel-strip">
        <div className="cs-track">
          {['Foto Kegiatan 1', 'Foto Kegiatan 2', 'Foto Kegiatan 3', 'Foto Kegiatan 4', 'Foto Kegiatan 5'].map((t, i) => (
            <img key={i} className="cs-img" src={`/carousel-${(i % 5) + 1}.jpg`} alt={t} />
          ))}
        </div>
      </div>

      {/* BERITA SECTION */}
      <section style={{ padding: '48px 0', background: 'var(--w)' }}>
        <div className="wrap">
          <div className="sl">
            <div className="sl-main">BERITA TERKINI</div>
            <div className="sl-more" onClick={() => setPage('berita')}>Lihat Semua <i className="fa-solid fa-arrow-right" /></div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>
          ) : (
            <div className="b3col" style={{ marginTop: 10 }}>
              <div className="nlist">
                {berita.slice(0, 5).map(item => (
                  <div key={item.id} className="ni" onClick={() => setPage('berita')}>
                    <img className="ni-img" src={item.imgUrl || '/placeholder.jpg'} alt={item.judul} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/84x60?text=No+Image'; }} />
                    <div>
                      <div className="ni-kat">{item.kategori.toUpperCase()}</div>
                      <div className="ni-t">{item.judul}</div>
                      <div className="ni-meta">{fmt(item.tanggal)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {renungan && (
                <div className="rw">
                  <div className="rw-head">
                    <span className="rh-lbl">RENUNGAN HARI INI</span>
                    <span className="rh-date">{fmt(renungan.tanggal)}</span>
                  </div>
                  <div className="rw-body">
                    <div className="rw-verse">"{renungan.ayat}"</div>
                    <div className="rw-ref">— {renungan.penulis}</div>
                    <div className="rw-text">{renungan.isi.substring(0, 120)}...</div>
                  </div>
                  <div className="rw-ft">
                    <span>{renungan.judul}</span>
                    <a onClick={() => setPage('renungan')}>Baca Selengkapnya</a>
                  </div>
                </div>
              )}
              <div>
                <div className="widget-box">
                  <div className="wb-head"><span><i className="fa-solid fa-clock" /> JADWAL IBADAH</span></div>
                  <div className="wbi">
                    <div className="wbi-icon sun"><i className="fa-solid fa-sun" /></div>
                    <div>
                      <div className="wbi-t">Ibadah Pagi</div>
                      <div className="wbi-s">Minggu, 08.00–10.30 WIB</div>
                    </div>
                  </div>
                  <div className="wbi">
                    <div className="wbi-icon moon"><i className="fa-solid fa-moon" /></div>
                    <div>
                      <div className="wbi-t">Ibadah Malam</div>
                      <div className="wbi-s">Minggu, 18.00–19.30 WIB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-img-grid">
            <div className="aig-main">
              <img src="/about-main.jpg" alt="Gereja" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x360?text=Gereja'; }} />
            </div>
            <div className="aig-sub"><img src="/about-1.jpg" alt="Kegiatan" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x180?text=1'; }} /></div>
            <div className="aig-sub"><img src="/about-2.jpg" alt="Kegiatan" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x180?text=2'; }} /></div>
          </div>
          <div className="about-right">
            <div className="ab-label">Tentang Kami</div>
            <h2>GBKP Runggun Tanjung Sari</h2>
            <p>GBKP Runggun Tanjung Sari adalah satu dari banyak runggun GBKP yang berada di Kota Medan. Kami berkomitmen untuk menjadi komunitas yang melayani dan menjangkau.</p>
            <div className="ab-verse">
              "Tetapi nabi-nabi itu menganiaya mereka dengan cara yang paling tidak baik."
              <strong>Yohanes 10:15</strong>
            </div>
            <div className="ab-stats">
              <div className="ab-stat"><div className="sn">25+</div><div className="sl">Tahun Melayani</div></div>
              <div className="ab-stat"><div className="sn">500+</div><div className="sl">Jemaat</div></div>
              <div className="ab-stat"><div className="sn">8</div><div className="sl">Sektor</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM SECTION */}
      <section className="program-section">
        <div className="ulos-zigzag inv" />
        <div className="ulos-border prog-ulos" />
        <div className="program-grid">
          {[
            { icon: 'fa-church', title: 'Ibadah Minggu', desc: 'Pagi & malam dengan pujian dan khotbah' },
            { icon: 'fa-children', title: 'Pemuda & Remaja', desc: 'Kegiatan pemuda karismatik' },
            { icon: 'fa-hands-praying', title: 'Doa Berdoa', desc: 'Persekutuhan doa jemaat' },
            { icon: 'fa-music', title: 'Pujian', desc: 'Persiapan pujian rohani' },
          ].map((p, i) => (
            <div key={i} className="pg-card">
              <div className="pg-card-icon" style={{ background: i === 0 ? 'rgba(185,28,28,.2)' : i === 1 ? 'rgba(217,119,6,.2)' : i === 2 ? 'rgba(22,163,74,.2)' : 'rgba(99,102,241,.2)', color: i === 0 ? 'var(--r)' : i === 1 ? 'var(--g3)' : i === 2 ? '#16A34A' : '#6366F1' }}>
                <i className={`fa-solid ${p.icon}`} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="ulos-border" style={{ marginTop: 20 }} />
        <div className="ulos-zigzag" />
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="cta-inner">
          <div className="cta-left">
            <h2>GBKP Runggun Tanjung Sari</h2>
            <p>Siap menyambut Anda dalam kehadirat Tuhan</p>
          </div>
          <div className="cta-actions">
            <button className="pc-btn-outline" style={{ background: 'rgba(255,255,255,.15)', borderColor: 'rgba(255,255,255,.5)', color: '#fff' }} onClick={() => setPage('kontak')}>
              <i className="fa-solid fa-map-location-dot" /> Lihat Lokasi
            </button>
          </div>
        </div>
      </section>
    </>
  );
}