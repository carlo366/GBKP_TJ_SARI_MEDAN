'use client';
import { useState, useEffect } from 'react';
import type { Page } from '@/app/page';

interface Berita {
  id: number;
  kategori: string;
  sektor: number | null;
  judul: string;
  ringkasan: string | null;
  isi: string;
  penulis: string;
  lokasi: string | null;
  jam: string | null;
  imgUrl: string | null;
  tanggal: string;
}

export default function Berita() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Berita | null>(null);
  const [kategori, setKategori] = useState('');
  const [sektor, setSektor] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (kategori) params.set('kategori', kategori);
    if (sektor) params.set('sektor', sektor);
    fetch(`/api/berita?${params}`)
      .then(r => r.json())
      .then(d => { setBerita(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [kategori, sektor]);

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const categories = ['', 'majelis', 'saitun', 'mamre', 'moria', 'permata', 'seraya', 'umum'];

  return (
    <div className="page-enter">
      <div className="ph">
        <div className="ph-inner">
          <div className="ph-eyebrow">Informasi Terkini</div>
          <h1 className="ph-title">Berita GBKP Tanjung Sari</h1>
          <p className="ph-sub">Berita terbaru seputar kegiatan dan perkembangan jemaat</p>
        </div>
      </div>

      <div className="wrap" style={{ padding: '20px 16px' }}>
        <div className="sl">
          <div className="sl-main">BERITA</div>
        </div>

        <div className="chips">
          {categories.map(cat => (
            <button key={cat} className={`chip${kategori === cat ? ' on' : ''}`} onClick={() => setKategori(cat)}>
              {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Semua'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>
        ) : berita.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--m)' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', marginBottom: 10 }} />
            <p>Tidak ada berita untuk kategori ini.</p>
          </div>
        ) : (
          <div className="bm-grid">
            {berita.map(item => (
              <div key={item.id} className="bn-card" onClick={() => setSelected(item)}>
                <div className="bn-imgw">
                  <img className="bn-img" src={item.imgUrl || '/placeholder.jpg'} alt={item.judul} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250?text=Berita'; }} />
                  <span className="bn-kat" style={{ background: 'var(--r)' }}>{item.kategori.toUpperCase()}</span>
                </div>
                <div className="bn-body">
                  <div className="bn-t">{item.judul}</div>
                  <div className="bn-desc">{item.ringkasan?.substring(0, 100)}...</div>
                  <div className="bn-meta"><i className="fa-solid fa-calendar" /> {fmt(item.tanggal)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="dmodal show" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="dmi">
            <img className="dmi-img" src={selected.imgUrl || '/placeholder.jpg'} alt={selected.judul} />
            <div className="dmi-body">
              <span className="dmi-kat" style={{ background: 'var(--r)' }}>{selected.kategori.toUpperCase()}</span>
              <h2 className="dmi-title">{selected.judul}</h2>
              <div className="dmi-meta">
                <span><i className="fa-solid fa-calendar" /> {fmt(selected.tanggal)}</span>
                <span><i className="fa-solid fa-user" /> {selected.penulis}</span>
              </div>
              <div className="dmi-content" dangerouslySetInnerHTML={{ __html: selected.isi.replace(/\n/g, '<br />') }} />
            </div>
            <div className="dmi-close">
              <button className="btn-cls" onClick={() => setSelected(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}