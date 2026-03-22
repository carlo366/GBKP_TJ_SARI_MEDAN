'use client';
import { useState, useEffect } from 'react';

interface MomoItem {
  id: number;
  tanggal: string;
  sesi: string;
  judul: string;
  pengkhotbah: string | null;
  ayatNas: string | null;
  persembahanPujian: string | null;
  fileUrl: string | null;
  fileName: string | null;
}

export default function Momo() {
  const [items, setItems] = useState<MomoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sesi, setSesi] = useState('');
  const [bulan, setBulan] = useState('');
  const [pdfModal, setPdfModal] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (sesi) params.set('sesi', sesi);
    if (bulan) params.set('bulan', bulan);
    setLoading(true);
    fetch(`/api/momo?${params}`)
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sesi, bulan]);

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="momo-bg page-enter">
      <div className="momo-page-header">
        <div className="badge"><i className="fa-solid fa-file-pdf" />&nbsp;Warta Jemaat</div>
        <h1>Momo (Warta Minggu)</h1>
        <p>Arsip warta jemaat GBKP Runggun Tanjung Sari</p>
      </div>

      <div className="momo-toolbar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {[['', 'Semua'], ['pagi', '☀ Pagi'], ['sore', '🌙 Sore']].map(([val, label]) => (
              <button key={val} className={`sf-chip${sesi === val ? ' active' + (val ? ' ' + val : '') : ''}`} onClick={() => setSesi(val)}>{label}</button>
            ))}
          </div>
          <div className="momo-search-wrap">
            <input type="month" value={bulan} onChange={e => setBulan(e.target.value)} placeholder="Filter bulan" />
          </div>
        </div>
        {bulan && (
          <button className="sf-chip" onClick={() => setBulan('')} style={{ whiteSpace: 'nowrap' as const }}>
            <i className="fa-solid fa-xmark" /> Reset
          </button>
        )}
      </div>

      <div className="momo-stats">
        <div className="mstat"><i className="fa-solid fa-file-pdf" /><strong>{items.length}</strong> warta ditemukan</div>
        {sesi && <div className="mstat"><i className="fa-solid fa-filter" />Sesi: <strong>{sesi}</strong></div>}
        {bulan && <div className="mstat"><i className="fa-solid fa-calendar" />Bulan: <strong>{bulan}</strong></div>}
      </div>

      <div className="momo-grid">
        {loading ? (
          <div className="mempty"><i className="fa-solid fa-spinner fa-spin" /><p>Memuat data...</p></div>
        ) : items.length === 0 ? (
          <div className="mempty"><i className="fa-solid fa-folder-open" /><p>Belum ada warta untuk filter ini.</p></div>
        ) : items.map(item => (
          <div key={item.id} className="mc">
            <div className={`mc-session-bar ${item.sesi}`} />
            <div className="mc-top">
              <span className="mc-date">{fmt(item.tanggal)}</span>
              <span className={`mc-session-tag ${item.sesi}`}>{item.sesi === 'pagi' ? '☀ Pagi' : '🌙 Sore'}</span>
              <h3>{item.judul}</h3>
            </div>
            <div className="mc-body">
              {item.pengkhotbah && (
                <div className="mc-pre"><i className="fa-solid fa-user-tie" />{item.pengkhotbah}</div>
              )}
              {item.ayatNas && (
                <div className="mc-verse">{item.ayatNas}</div>
              )}
              {item.persembahanPujian && (() => {
                try {
                  const list: string[] = JSON.parse(item.persembahanPujian);
                  if (list.length === 0) return null;
                  return (
                    <div style={{ margin: '10px 0', background: 'rgba(245,166,35,.08)', border: '1px solid rgba(245,166,35,.2)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--gold-2)', letterSpacing: 1, marginBottom: 7, textTransform: 'uppercase' as const }}>
                        <i className="fa-solid fa-music" style={{ marginRight: 6 }} />Persembahan Pujian
                      </div>
                      {list.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < list.length - 1 ? 5 : 0 }}>
                          <span style={{ background: 'var(--gold)', color: 'var(--dark)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <span style={{ fontSize: '.83rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  );
                } catch { return null; }
              })()}
              {item.fileUrl ? (
                <button className="btn-pdf" onClick={() => setPdfModal({ url: item.fileUrl!, title: item.judul })}>
                  <i className="fa-solid fa-file-pdf" /> Buka PDF
                </button>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: '.8rem', padding: '8px 0' }}>
                  <i className="fa-solid fa-file-slash" /> File belum tersedia
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {pdfModal && (
        <div className="pdf-modal open" onClick={e => { if (e.target === e.currentTarget) setPdfModal(null); }}>
          <div className="pdf-modal-inner">
            <div className="pdf-modal-header">
              <h4>{pdfModal.title}</h4>
              <button className="pdf-modal-close" onClick={() => setPdfModal(null)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="pdf-frame-container">
              <iframe src={pdfModal.url} title={pdfModal.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
