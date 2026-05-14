'use client';
import { useState, useEffect } from 'react';

interface Renungan {
  id: number;
  tanggal: string;
  ayat: string;
  judul: string;
  isi: string;
  penulis: string;
  imgUrl: string | null;
}

export default function Renungan() {
  const [renungan, setRenungan] = useState<Renungan | null>(null);
  const [list, setList] = useState<Renungan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Renungan | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/renungan/latest').then(r => r.json()),
      fetch('/api/renungan?limit=10').then(r => r.json()),
    ]).then(([r, l]) => {
      setRenungan(r);
      setList(Array.isArray(l) ? l : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="page-enter">
      <div className="ph">
        <div className="ph-inner">
          <div className="ph-eyebrow">Renungan Harian</div>
          <h1 className="ph-title">Renungan & Video</h1>
          <p className="ph-sub">Renungan rohani harian GBKP Runggun Tanjung Sari</p>
        </div>
      </div>

      <div className="ren-wrap">
        {/* Featured Renungan */}
        {renungan && (
          <div className="ren-featured">
            <div className="rf-top">
              <div className="rf-lbl">RENUNGAN HARI INI</div>
              <div className="rf-date">{fmt(renungan.tanggal)}</div>
              <div className="rf-verse">"{renungan.ayat}"</div>
              <div className="rf-ref">— {renungan.penulis}</div>
            </div>
            <div className="rf-body">
              <div className="rf-text" dangerouslySetInnerHTML={{ __html: renungan.isi.substring(0, 300) + '...' }} />
              <div className="rf-author">
                <span>{renungan.judul}</span>
                <a onClick={() => setSelected(renungan)}>Baca Selengkapnya</a>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="vid-grid" style={{ marginTop: 20 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="vc">
              <div className="vc-thumb">
                <img src={`/renungan-thumb-${i}.jpg`} alt={`Video ${i}`} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x180?text=Video'; }} />
                <div className="vc-play">
                  <div className="vc-pb"><i className="fa-solid fa-play" /></div>
                </div>
              </div>
              <div className="vc-body">
                <div className="vc-t">Judul Video Renungan {i}</div>
                <div className="vc-meta">{fmt(new Date().toISOString())}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Arsip Renungan */}
        <div className="ra-box" style={{ marginTop: 20 }}>
          <div className="ra-hd">
            <span>Arsip Renungan</span>
          </div>
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
            ) : list.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--m)' }}>
                <i className="fa-solid fa-folder-open" style={{ fontSize: '2rem', marginBottom: 10 }} />
                <p>Belum ada arsip renungan</p>
              </div>
            ) : (
              list.map(item => (
                <div key={item.id} className={`ra-item${selected?.id === item.id ? ' on' : ''}`} onClick={() => setSelected(item)}>
                  <div className="ra-d">{new Date(item.tanggal).getDate()}</div>
                  <div>
                    <div className="ra-t">{item.judul}</div>
                    <div className="ra-ref">{item.ayat}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="dmodal show" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="dmi">
            <div className="dmi-body">
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