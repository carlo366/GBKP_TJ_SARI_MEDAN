'use client';
import { useState, useEffect } from 'react';

interface Keuangan {
  id: number;
  tanggal: string;
  tipe: string;
  keterangan: string;
  jumlah: number;
  kategori: string;
}

export default function Keuangan() {
  const [keuangan, setKeuangan] = useState<Keuangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tanggal: '', tipe: 'masuk', keterangan: '', jumlah: '', kategori: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (bulan) params.set('bulan', bulan);
    fetch(`/api/keuangan?${params}`)
      .then(r => r.json())
      .then(d => { setKeuangan(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [bulan]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch('/api/keuangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, jumlah: parseFloat(form.jumlah) })
      });
      if (res.ok) {
        setMsg('Data berhasil disimpan');
        setShowForm(false);
        setForm({ tanggal: '', tipe: 'masuk', keterangan: '', jumlah: '', kategori: '' });
        fetch(`/api/keuangan${bulan ? '?bulan=' + bulan : ''}`).then(r => r.json()).then(setKeuangan);
      } else {
        const err = await res.json();
        setMsg(err.error || 'Gagal menyimpan');
      }
    } catch {
      setMsg('Terjadi kesalahan');
    }
    setSubmitting(false);
  };

  const totalMasuk = keuangan.filter(k => k.tipe === 'masuk').reduce((a, b) => a + b.jumlah, 0);
  const totalKeluar = keuangan.filter(k => k.tipe === 'keluar').reduce((a, b) => a + b.jumlah, 0);
  const saldo = totalMasuk - totalKeluar;

  return (
    <div className="page-enter">
      <div className="ph">
        <div className="ph-inner">
          <div className="ph-eyebrow">Keuangan Gereja</div>
          <h1 className="ph-title">Laporan Keuangan</h1>
          <p className="ph-sub">Pemasukan dan pengeluaran GBKP Runggun Tanjung Sari</p>
        </div>
      </div>

      <div className="keu-wrap">
        {/* Stats Cards */}
        <div className="keu-cards">
          <div className="kc in">
            <div className="kc-stripe" />
            <i className="fa-solid fa-arrow-up kc-icon" />
            <div className="kc-lbl">TOTAL PEMASUKAN</div>
            <div className="kc-amt">Rp {totalMasuk.toLocaleString('id-ID')}</div>
            <div className="kc-sub">{keuangan.filter(k => k.tipe === 'masuk').length} transaksi</div>
          </div>
          <div className="kc out">
            <div className="kc-stripe" />
            <i className="fa-solid fa-arrow-down kc-icon" />
            <div className="kc-lbl">TOTAL PENGELUARAN</div>
            <div className="kc-amt">Rp {totalKeluar.toLocaleString('id-ID')}</div>
            <div className="kc-sub">{keuangan.filter(k => k.tipe === 'keluar').length} transaksi</div>
          </div>
          <div className="kc bal">
            <div className="kc-stripe" />
            <i className="fa-solid fa-wallet kc-icon" />
            <div className="kc-lbl">SALDO TERKINI</div>
            <div className="kc-amt">Rp {saldo.toLocaleString('id-ID')}</div>
            <div className="kc-sub">Total pemasukan - pengeluaran</div>
          </div>
        </div>

        {/* Table & Form */}
        <div className="keu-body">
          <div className="ktable-wrap">
            <div className="kth">
              <h3>Daftar Transaksi</h3>
              <input type="month" value={bulan} onChange={e => setBulan(e.target.value)} />
            </div>
            <table className="ktbl">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Tipe</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
                ) : keuangan.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>Belum ada data</td></tr>
                ) : (
                  keuangan.map(item => (
                    <tr key={item.id}>
                      <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                      <td>{item.keterangan}</td>
                      <td>{item.kategori}</td>
                      <td>Rp {item.jumlah.toLocaleString('id-ID')}</td>
                      <td><span className={`kbadge ${item.tipe}`}>{item.tipe === 'masuk' ? 'Masuk' : 'Keluar'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Form */}
          <div className="kform-wrap">
            <div className="kf-hd">
              <h3><i className="fa-solid fa-plus" /> Tambah Transaksi</h3>
            </div>
            <div className="kf-body">
              <form onSubmit={handleSave}>
                <div className="type-toggle">
                  <button type="button" className={`ttbtn in${form.tipe === 'masuk' ? ' on' : ''}`} onClick={() => setForm({ ...form, tipe: 'masuk' })}>
                    <i className="fa-solid fa-arrow-up" /> PEMASUKAN
                  </button>
                  <button type="button" className={`ttbtn out${form.tipe === 'keluar' ? ' on' : ''}`} onClick={() => setForm({ ...form, tipe: 'keluar' })}>
                    <i className="fa-solid fa-arrow-down" /> PENGELUARAN
                  </button>
                </div>
                <div className="fg">
                  <label>Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} required />
                </div>
                <div className="fg">
                  <label>Jumlah (Rp)</label>
                  <input type="number" value={form.jumlah} onChange={e => setForm({ ...form, jumlah: e.target.value })} required />
                </div>
                <div className="fg">
                  <label>Keterangan</label>
                  <input type="text" value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} required />
                </div>
                <div className="fg">
                  <label>Kategori</label>
                  <input type="text" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })} placeholder="SPP, Persembahan, dll" />
                </div>
                <button type="submit" className="btsave" disabled={submitting}>
                  {submitting ? <><i className="fa-solid fa-spinner fa-spin" /> Menyimpan...</> : <><i className="fa-solid fa-save" /> Simpan</>}
                </button>
                {msg && <div style={{ marginTop: 10, color: msg.includes('berhasil') ? 'green' : 'red' }}>{msg}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}