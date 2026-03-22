'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteConfig } from '@/lib/useSiteConfig';
import { defaultConfig } from '@/lib/useSiteConfig';

interface MomoItem {
  id: number; tanggal: string; sesi: string; judul: string;
  pengkhotbah: string | null; ayatNas: string | null; fileUrl: string | null; fileName: string | null;
}

type Tab = 'warta' | 'pengaturan';

const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: '.88rem', boxSizing: 'border-box', fontFamily: 'Nunito,sans-serif' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '.78rem', fontWeight: 700, marginBottom: 5, color: 'var(--gold-2)', letterSpacing: .5 };
const card: React.CSSProperties = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(245,166,35,.2)', borderRadius: 14, padding: '18px 18px', marginBottom: 18 };

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('warta');
  const [items, setItems] = useState<MomoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const [form, setForm] = useState({ tanggal: '', sesi: 'pagi', judul: '', pengkhotbah: '', ayatNas: '', fileUrl: '', fileName: '' });
  const [pujianList, setPujianList] = useState<string[]>(['']);
  const [file, setFile] = useState<File | null>(null);

  const [cfg, setCfg] = useState<SiteConfig>(defaultConfig);
  const [cfgSaving, setCfgSaving] = useState(false);
  const [cfgMsg, setCfgMsg] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const fetchItems = () => {
    fetch('/api/momo').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  };
  const fetchConfig = () => {
    fetch('/api/config').then(r => r.json()).then(d => setCfg({ ...defaultConfig, ...d })).catch(() => {});
  };

  useEffect(() => {
    fetch('/api/auth/check').then(r => {
      if (!r.ok) router.replace('/admin');
      else { fetchItems(); fetchConfig(); }
    }).catch(() => router.replace('/admin'));
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin');
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json(); setUploading(false);
    if (res.ok) { setForm(f => ({ ...f, fileUrl: data.fileUrl, fileName: data.fileName })); setMsg('File berhasil diupload.'); }
    else setMsg(data.error || 'Upload gagal.');
  }

  async function handleLogoUpload() {
    if (!logoFile) return;
    setLogoUploading(true);
    const fd = new FormData(); fd.append('file', logoFile);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json(); setLogoUploading(false);
    if (res.ok) { setCfg(c => ({ ...c, logoUrl: data.fileUrl })); setCfgMsg('Logo berhasil diupload.'); }
    else setCfgMsg(data.error || 'Upload logo gagal.');
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault(); setSaving(true); setMsg('');
    const res = await fetch('/api/momo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, persembahanPujian: pujianList.filter(s => s.trim()) }) });
    const data = await res.json(); setSaving(false);
    if (res.ok) { setMsg('Warta berhasil disimpan.'); setShowForm(false); setForm({ tanggal: '', sesi: 'pagi', judul: '', pengkhotbah: '', ayatNas: '', fileUrl: '', fileName: '' }); setPujianList(['']); setFile(null); fetchItems(); }
    else setMsg(data.error || 'Gagal menyimpan.');
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus warta ini?')) return;
    const res = await fetch(`/api/momo/${id}`, { method: 'DELETE' });
    if (res.ok) { setMsg('Warta dihapus.'); fetchItems(); } else setMsg('Gagal menghapus.');
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault(); setPwMsg('');
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg('Password baru tidak cocok.'); return; }
    if (pwForm.newPw.length < 6) { setPwMsg('Password baru minimal 6 karakter.'); return; }
    setPwSaving(true);
    const res = await fetch('/api/auth/password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) });
    const data = await res.json(); setPwSaving(false);
    if (res.ok) { setPwMsg('Password berhasil diubah.'); setPwForm({ current: '', newPw: '', confirm: '' }); setTimeout(() => { setShowPwForm(false); setPwMsg(''); }, 2000); }
    else setPwMsg(data.error || 'Gagal mengubah password.');
  }

  async function handleSaveConfig(e: FormEvent) {
    e.preventDefault(); setCfgSaving(true); setCfgMsg('');
    const res = await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
    const data = await res.json(); setCfgSaving(false);
    if (res.ok) { setCfgMsg('Pengaturan berhasil disimpan.'); setCfg({ ...defaultConfig, ...data }); }
    else setCfgMsg(data.error || 'Gagal menyimpan pengaturan.');
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const logo = cfg.logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png';
  const alertStyle = (ok: boolean): React.CSSProperties => ({
    background: ok ? 'rgba(0,180,0,.15)' : 'rgba(192,20,10,.2)',
    border: `1px solid ${ok ? '#00c014' : '#c0140a'}`,
    borderRadius: 8, padding: '9px 14px', marginBottom: 14, fontSize: '.84rem', color: '#fff',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', color: '#fff', fontFamily: 'Nunito,sans-serif' }}>
      <style>{`
        .db-topbar { background: var(--red-deep); border-bottom: 3px solid var(--gold); padding: 0 16px; display: flex; align-items: center; justify-content: space-between; min-height: 60px; gap: 8px; flex-wrap: wrap; }
        .db-topbar-left { display: flex; align-items: center; gap: 10px; }
        .db-topbar-right { display: flex; gap: 6px; flex-wrap: wrap; }
        .db-btn { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: #fff; padding: 6px 11px; border-radius: 7px; cursor: pointer; font-size: .78rem; font-family: Nunito,sans-serif; white-space: nowrap; }
        .db-btn:hover { background: rgba(255,255,255,.18); }
        .db-tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 2px solid rgba(245,166,35,.2); overflow-x: auto; }
        .db-tab { background: rgba(255,255,255,.07); color: rgba(255,255,255,.6); border: none; padding: 9px 16px; border-radius: 10px 10px 0 0; font-weight: 700; font-size: .82rem; cursor: pointer; font-family: Nunito,sans-serif; white-space: nowrap; transition: .15s; }
        .db-tab.active { background: var(--gold); color: var(--dark); }
        .db-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .db-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .db-grid-full { grid-column: 1 / -1; }
        @media (max-width: 640px) {
          .db-topbar { padding: 10px 12px; }
          .db-topbar-left span { display: none; }
          .db-btn { padding: 6px 9px; font-size: .74rem; }
          .db-grid2, .db-grid3 { grid-template-columns: 1fr; }
          .db-grid-full { grid-column: 1; }
        }
        @media (max-width: 480px) {
          .db-tab { padding: 8px 12px; font-size: .76rem; }
        }
        .fg label { display: block; font-size: .78rem; font-weight: 700; margin-bottom: 5px; letter-spacing: .4px; }
        .fg input, .fg select, .fg textarea { width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid #ddd; font-size: .88rem; box-sizing: border-box; font-family: Nunito,sans-serif; }
        .fg { margin-bottom: 14px; }
        .f-cancel { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: #fff; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-family: Nunito,sans-serif; font-size: .85rem; }
        .f-save { background: var(--gold); color: var(--dark); border: none; padding: 9px 22px; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: Nunito,sans-serif; font-size: .85rem; }
        .f-save:disabled, .f-cancel:disabled { opacity: .6; cursor: not-allowed; }
        .warta-item { background: rgba(255,255,255,.06); border: 1px solid rgba(245,166,35,.2); border-radius: 12px; padding: 14px 16px; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .warta-actions { display: flex; gap: 7px; align-items: center; flex-shrink: 0; }
        @media (max-width: 480px) {
          .warta-item { flex-direction: column; }
          .warta-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      {/* Topbar */}
      <div className="db-topbar">
        <div className="db-topbar-left">
          <img src={logo} alt="GBKP" width={36} height={36} style={{ borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 13 }}>Admin Dashboard</span>
        </div>
        <div className="db-topbar-right">
          <a href="/" className="db-btn"><i className="fa-solid fa-globe" /> <span style={{ display: 'inline' }}>Website</span></a>
          <button className="db-btn" onClick={() => { setShowPwForm(v => !v); setPwMsg(''); }}>
            <i className="fa-solid fa-key" /> <span>Password</span>
          </button>
          <button className="db-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" /> <span>Logout</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 14px' }}>

        {/* Ganti Password */}
        {showPwForm && (
          <div style={{ ...card, background: 'rgba(245,166,35,.08)', border: '1px solid rgba(245,166,35,.35)' }}>
            <h3 style={{ fontFamily: 'Cinzel,serif', color: 'var(--gold-2)', marginBottom: 16, fontSize: '.95rem' }}>
              <i className="fa-solid fa-key" style={{ marginRight: 8 }} />Ganti Password
            </h3>
            <form onSubmit={handleChangePassword}>
              <div className="db-grid3">
                {([
                  { label: 'Password Lama', val: pwForm.current, key: 'current', show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                  { label: 'Password Baru', val: pwForm.newPw, key: 'newPw', show: showNew, toggle: () => setShowNew(v => !v) },
                  { label: 'Konfirmasi Baru', val: pwForm.confirm, key: 'confirm', show: showConfirm, toggle: () => setShowConfirm(v => !v) },
                ] as { label: string; val: string; key: string; show: boolean; toggle: () => void }[]).map(({ label, val, key, show, toggle }) => (
                  <div key={key} className="fg">
                    <label style={{ color: 'var(--gold-2)' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input type={show ? 'text' : 'password'} value={val} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} required style={{ paddingRight: 40, background: 'rgba(255,255,255,.92)' }} />
                      <button type="button" onClick={toggle} tabIndex={-1} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14, padding: 3 }}>
                        <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {pwMsg && <div style={alertStyle(pwMsg.includes('berhasil'))}>{pwMsg}</div>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" className="f-cancel" onClick={() => { setShowPwForm(false); setPwMsg(''); setPwForm({ current: '', newPw: '', confirm: '' }); }}>Batal</button>
                <button type="submit" className="f-save" disabled={pwSaving}>{pwSaving ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan...</> : <><i className="fa-solid fa-floppy-disk" /> Simpan</>}</button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="db-tabs">
          <button className={`db-tab${tab === 'warta' ? ' active' : ''}`} onClick={() => setTab('warta')}>
            <i className="fa-solid fa-file-lines" style={{ marginRight: 6 }} />Kelola Warta
          </button>
          <button className={`db-tab${tab === 'pengaturan' ? ' active' : ''}`} onClick={() => setTab('pengaturan')}>
            <i className="fa-solid fa-gear" style={{ marginRight: 6 }} />Pengaturan Situs
          </button>
        </div>

        {/* ===== TAB WARTA ===== */}
        {tab === 'warta' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontFamily: 'Cinzel,serif', color: 'var(--gold-2)', fontSize: '1.15rem' }}>Kelola Warta (Momo)</h2>
                <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem', marginTop: 3 }}>{items.length} warta tersimpan</p>
              </div>
              <button onClick={() => { setShowForm(true); setMsg(''); }} style={{ background: 'var(--gold)', color: 'var(--dark)', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', display: 'flex', alignItems: 'center', gap: 7, fontSize: '.88rem' }}>
                <i className="fa-solid fa-plus" /> Tambah Warta
              </button>
            </div>

            {msg && <div style={alertStyle(!msg.toLowerCase().includes('gagal'))}>{msg}</div>}

            {showForm && (
              <div style={card}>
                <h3 style={{ fontFamily: 'Cinzel,serif', color: 'var(--gold-2)', marginBottom: 16, fontSize: '.92rem' }}>
                  <i className="fa-solid fa-file-circle-plus" style={{ marginRight: 8 }} />Tambah Warta Baru
                </h3>
                <form onSubmit={handleSave}>
                  <div className="db-grid2">
                    <div className="fg"><label>Tanggal</label><input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} required style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                    <div className="fg"><label>Sesi</label><select value={form.sesi} onChange={e => setForm(f => ({ ...f, sesi: e.target.value }))} style={{ background: 'rgba(255,255,255,.92)' }}><option value="pagi">Pagi</option><option value="sore">Sore</option></select></div>
                  </div>
                  <div className="fg"><label>Judul Khotbah</label><input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul khotbah minggu ini" required style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                  <div className="db-grid2">
                    <div className="fg"><label>Pengkhotbah</label><input type="text" value={form.pengkhotbah} onChange={e => setForm(f => ({ ...f, pengkhotbah: e.target.value }))} placeholder="Nama pengkhotbah" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                    <div className="fg"><label>Ayat Nas</label><input type="text" value={form.ayatNas} onChange={e => setForm(f => ({ ...f, ayatNas: e.target.value }))} placeholder="Mis: Yohanes 3:16" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                  </div>
                  {/* Persembahan Pujian */}
                  <div className="fg">
                    <label>Persembahan Pujian <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 400 }}>(bisa lebih dari 1)</span></label>
                    {pujianList.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 7, alignItems: 'center' }}>
                        <input type="text" value={p} onChange={e => { const n = [...pujianList]; n[i] = e.target.value; setPujianList(n); }} placeholder={`Pujian ${i + 1} — mis: KJ 23 "Yesus Kekasihku"`} style={{ background: 'rgba(255,255,255,.92)', flex: 1 }} />
                        {pujianList.length > 1 && (
                          <button type="button" onClick={() => setPujianList(pujianList.filter((_, j) => j !== i))} style={{ background: 'rgba(192,20,10,.25)', border: '1px solid rgba(192,20,10,.4)', color: '#ff6b6b', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', flexShrink: 0 }}>
                            <i className="fa-solid fa-minus" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setPujianList([...pujianList, ''])} style={{ background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.35)', color: 'var(--gold-2)', borderRadius: 7, padding: '6px 14px', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, fontFamily: 'Nunito,sans-serif' }}>
                      <i className="fa-solid fa-plus" style={{ marginRight: 5 }} />Tambah Pujian
                    </button>
                  </div>
                  {/* File Upload */}
                  <div className="fg">
                    <label>File Warta (PDF / Word / Gambar)</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)} style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,.92)' }} />
                      <button type="button" onClick={handleUpload} disabled={!file || uploading} style={{ background: 'var(--gold)', color: 'var(--dark)', border: 'none', padding: '9px 14px', borderRadius: 8, fontWeight: 700, cursor: file && !uploading ? 'pointer' : 'not-allowed', opacity: !file || uploading ? .6 : 1, fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap', fontSize: '.82rem' }}>
                        {uploading ? <><i className="fa-solid fa-spinner fa-spin" /> Upload...</> : <><i className="fa-solid fa-upload" /> Upload</>}
                      </button>
                    </div>
                    {form.fileUrl && <small style={{ color: 'var(--gold)', marginTop: 4, display: 'block' }}><i className="fa-solid fa-check" /> {form.fileName}</small>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button type="button" className="f-cancel" onClick={() => setShowForm(false)}>Batal</button>
                    <button type="submit" className="f-save" disabled={saving}>{saving ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan...</> : <><i className="fa-solid fa-floppy-disk" /> Simpan</>}</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,.4)' }}><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} /></div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,.3)' }}>
                <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', marginBottom: 12, display: 'block' }} />
                <p>Belum ada warta. Klik &ldquo;Tambah Warta&rdquo; untuk mulai.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <div key={item.id} className="warta-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{ background: 'var(--gold)', color: 'var(--dark)', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{fmt(item.tanggal)}</span>
                        <span style={{ background: item.sesi === 'pagi' ? 'rgba(245,166,35,.2)' : 'rgba(155,63,200,.25)', color: item.sesi === 'pagi' ? 'var(--gold-2)' : '#c084fc', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, border: `1px solid ${item.sesi === 'pagi' ? 'rgba(245,166,35,.3)' : 'rgba(155,63,200,.35)'}` }}>
                          {item.sesi === 'pagi' ? '☀ Pagi' : '🌙 Sore'}
                        </span>
                      </div>
                      <p style={{ fontWeight: 700, color: '#fff', fontSize: '.9rem', marginBottom: 2 }}>{item.judul}</p>
                      {item.pengkhotbah && <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.78rem' }}><i className="fa-solid fa-user-tie" style={{ marginRight: 5 }} />{item.pengkhotbah}</p>}
                    </div>
                    <div className="warta-actions">
                      {item.fileUrl && (
                        <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)', color: 'var(--gold-2)', padding: '6px 12px', borderRadius: 8, fontSize: '.78rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          <i className="fa-solid fa-file" /> File
                        </a>
                      )}
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(192,20,10,.2)', border: '1px solid rgba(192,20,10,.4)', color: '#ff6b6b', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '.78rem', fontWeight: 700, fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap' }}>
                        <i className="fa-solid fa-trash" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== TAB PENGATURAN ===== */}
        {tab === 'pengaturan' && (
          <form onSubmit={handleSaveConfig}>
            <h2 style={{ fontFamily: 'Cinzel,serif', color: 'var(--gold-2)', fontSize: '1.1rem', marginBottom: 20 }}>Pengaturan Situs</h2>

            {/* Logo */}
            <div style={card}>
              <h4 style={{ color: 'var(--gold-2)', marginBottom: 14, fontSize: '.88rem' }}><i className="fa-solid fa-image" style={{ marginRight: 7 }} />Logo Gereja</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                <img src={cfg.logoUrl || logo} alt="Logo" width={60} height={60} style={{ borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="fg">
                    <label style={{ color: 'var(--gold-2)' }}>URL Logo</label>
                    <input type="text" value={cfg.logoUrl} onChange={e => setCfg(c => ({ ...c, logoUrl: e.target.value }))} placeholder="https://... atau /uploads/..." style={{ background: 'rgba(255,255,255,.92)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={e => setLogoFile(e.target.files?.[0] || null)} style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,.92)', padding: '6px 8px', borderRadius: 8, border: '1px solid #ddd', fontSize: '.82rem' }} />
                    <button type="button" onClick={handleLogoUpload} disabled={!logoFile || logoUploading} style={{ background: 'var(--gold)', color: 'var(--dark)', border: 'none', padding: '8px 13px', borderRadius: 8, fontWeight: 700, cursor: logoFile && !logoUploading ? 'pointer' : 'not-allowed', opacity: !logoFile || logoUploading ? .6 : 1, fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap', fontSize: '.8rem' }}>
                      {logoUploading ? <><i className="fa-solid fa-spinner fa-spin" /> Upload...</> : <><i className="fa-solid fa-upload" /> Upload</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ibadah Pagi */}
            <div style={card}>
              <h4 style={{ color: 'var(--gold-2)', marginBottom: 14, fontSize: '.88rem' }}><i className="fa-solid fa-sun" style={{ marginRight: 7 }} />Ibadah Pagi</h4>
              <div className="db-grid3">
                <div className="fg"><label style={lbl}>Jam Mulai</label><input type="text" value={cfg.pagiMulai} onChange={e => setCfg(c => ({ ...c, pagiMulai: e.target.value }))} placeholder="08.00" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>Jam Selesai</label><input type="text" value={cfg.pagiSelesai} onChange={e => setCfg(c => ({ ...c, pagiSelesai: e.target.value }))} placeholder="10.30" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>Bahasa</label><input type="text" value={cfg.pagiBahasa} onChange={e => setCfg(c => ({ ...c, pagiBahasa: e.target.value }))} placeholder="Bahasa Karo / Indonesia" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
              </div>
            </div>

            {/* Ibadah Sore */}
            <div style={card}>
              <h4 style={{ color: 'var(--gold-2)', marginBottom: 14, fontSize: '.88rem' }}><i className="fa-solid fa-moon" style={{ marginRight: 7 }} />Ibadah Sore</h4>
              <div className="db-grid3">
                <div className="fg"><label style={lbl}>Jam Mulai</label><input type="text" value={cfg.soreMulai} onChange={e => setCfg(c => ({ ...c, soreMulai: e.target.value }))} placeholder="17.00" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>Jam Selesai</label><input type="text" value={cfg.soreSelesai} onChange={e => setCfg(c => ({ ...c, soreSelesai: e.target.value }))} placeholder="19.00" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>Bahasa</label><input type="text" value={cfg.soreBahasa} onChange={e => setCfg(c => ({ ...c, soreBahasa: e.target.value }))} placeholder="Bahasa Indonesia" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
              </div>
            </div>

            {/* Kontak & Lokasi */}
            <div style={card}>
              <h4 style={{ color: 'var(--gold-2)', marginBottom: 14, fontSize: '.88rem' }}><i className="fa-solid fa-location-dot" style={{ marginRight: 7 }} />Kontak & Lokasi</h4>
              <div className="fg db-grid-full"><label style={lbl}>Alamat Lengkap</label><input type="text" value={cfg.alamat} onChange={e => setCfg(c => ({ ...c, alamat: e.target.value }))} style={{ background: 'rgba(255,255,255,.92)' }} /></div>
              <div className="db-grid2">
                <div className="fg"><label style={lbl}>Telepon</label><input type="text" value={cfg.telepon} onChange={e => setCfg(c => ({ ...c, telepon: e.target.value }))} placeholder="+62 61 XXX XXXX" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>WhatsApp</label><input type="text" value={cfg.whatsapp} onChange={e => setCfg(c => ({ ...c, whatsapp: e.target.value }))} placeholder="+62 8XX XXXX XXXX" style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>Email</label><input type="email" value={cfg.email} onChange={e => setCfg(c => ({ ...c, email: e.target.value }))} style={{ background: 'rgba(255,255,255,.92)' }} /></div>
                <div className="fg"><label style={lbl}>Link Google Maps</label><input type="text" value={cfg.mapsUrl} onChange={e => setCfg(c => ({ ...c, mapsUrl: e.target.value }))} style={{ background: 'rgba(255,255,255,.92)' }} /></div>
              </div>
              <div className="fg"><label style={lbl}>Embed Maps URL (iframe src)</label><input type="text" value={cfg.mapsEmbed} onChange={e => setCfg(c => ({ ...c, mapsEmbed: e.target.value }))} style={{ background: 'rgba(255,255,255,.92)' }} /></div>
            </div>

            {cfgMsg && <div style={alertStyle(cfgMsg.includes('berhasil'))}>{cfgMsg}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 32 }}>
              <button type="submit" className="f-save" disabled={cfgSaving} style={{ fontSize: '.9rem', padding: '11px 26px' }}>
                {cfgSaving ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan...</> : <><i className="fa-solid fa-floppy-disk" /> Simpan Pengaturan</>}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
