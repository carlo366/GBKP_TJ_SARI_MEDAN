'use client';
import { useState, useEffect } from 'react';

interface AnggotaOrg {
  id: number;
  kategori: string;
  level: string;
  sektor: number | null;
  jabatan: string;
  nama: string;
  noWa: string | null;
}

const ORG_TABS = [
  { key: 'majelis', label: 'Majelis' },
  { key: 'saitun', label: 'Saitun' },
  { key: 'mamre', label: 'Mamre' },
  { key: 'moria', label: 'Moria' },
  { key: 'permata', label: 'Permata' },
  { key: 'seraya', label: 'Seraya' },
];

const SEKTOR_COLORS: Record<string, string> = {
  saitun: 'linear-gradient(135deg,#14532d,#15803d)',
  mamre: 'linear-gradient(135deg,#7c2d12,#c24106)',
  moria: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
  permata: 'linear-gradient(135deg,#581c87,#7e22ce)',
  seraya: 'linear-gradient(135deg,#134e4a,#0f766e)',
};

export default function Organisasi() {
  const [tab, setTab] = useState('majelis');
  const [anggota, setAnggota] = useState<AnggotaOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [sektorOpen, setSektorOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/anggota-org?kategori=${tab}`)
      .then(r => r.json())
      .then(d => { setAnggota(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tab]);

  const majelis = anggota.filter(a => a.level === 'klasis' && a.sektor === null);
  const sektors = [...new Set(anggota.filter(a => a.level === 'sektor').map(a => a.sektor))].sort((a, b) => (a || 0) - (b || 0));

  return (
    <div className="page-enter">
      <div className="ph">
        <div className="ph-inner">
          <div className="ph-eyebrow">Struktur Organisasi</div>
          <h1 className="ph-title">Organisasi GBKP Tanjung Sari</h1>
          <p className="ph-sub">Susunan pengurus dan majelis jemaat kami</p>
        </div>
      </div>

      <div className="org-wrap">
        {/* MAJELIS SECTION */}
        {tab === 'majelis' && (
          <div className="mj-box" style={{ marginTop: 30 }}>
            <div className="mj-hd">
              <h2>Majelis GBKP Tanjung Sari</h2>
              <span>Ketua: Pdt. {majelis.find(m => m.jabatan.toLowerCase().includes('ketua'))?.nama || '_____'} | Sekretaris: {majelis.find(m => m.jabatan.toLowerCase().includes('sekretaris'))?.nama || '_____'}.</span>
            </div>
            <div className="mj-grid">
              {majelis.map(item => (
                <div key={item.id} className="mj-card">
                  <div className="mj-role">{item.jabatan.toUpperCase()}</div>
                  <div className="mj-name">{item.nama}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORG TABS */}
        <div className="org-tabs" style={{ marginTop: 30 }}>
          {ORG_TABS.map(t => (
            <button key={t.key} className={`ot${tab === t.key ? ' on' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ORG PANELS */}
        {tab !== 'majelis' && (
          <div className="opanel on">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>
            ) : sektors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--m)' }}>
                <i className="fa-solid fa-folder-open" style={{ fontSize: '2rem', marginBottom: 10 }} />
                <p>Belum ada data pengurus</p>
              </div>
            ) : (
              sektors.map(sektor => {
                const sektorAnggota = anggota.filter(a => a.sektor === sektor && a.level === 'sektor');
                return (
                  <div key={sektor} className="sk-list">
                    <div className={`sk-item${sektorOpen === String(sektor) ? ' open' : ''}`}>
                      <div className="sk-hd" onClick={() => setSektorOpen(sektorOpen === String(sektor) ? null : String(sektor))}>
                        <div className={`sk-num`} style={{ background: 'var(--r)' }}>{sektor}</div>
                        <div className="sk-info">
                          <h4>Sektor {sektor}</h4>
                          <div className="sk-sub">{sektorAnggota.length} pengurus</div>
                        </div>
                        <i className="fa-solid fa-chevron-down sk-chev" />
                      </div>
                      <div className="sk-body">
                        <div className="sk-body-inner">
                          <div className="sk-person-grid">
                            {sektorAnggota.map(item => (
                              <div key={item.id} className="pcard">
                                <div className="pcard-photo" style={{ background: 'var(--m5)' }}>
                                  <i className="fa-solid fa-user" />
                                </div>
                                <div className="pcard-body">
                                  <div className="pcard-role">{item.jabatan.toUpperCase()}</div>
                                  <div className="pcard-name">{item.nama}</div>
                                  {item.noWa && (
                                    <a href={`https://wa.me/${item.noWa.replace(/[^0-9]/g, '')}`} className="pcard-wa">
                                      <i className="fa-brands fa-whatsapp" /> {item.noWa}
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}