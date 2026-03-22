'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function AdminLogin() {
  const router = useRouter();
  const { config } = useSiteConfig();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    fetch('/api/auth/check').then(r => {
      if (r.ok) router.replace('/admin/dashboard');
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--gold)', fontSize: '2rem' }} />
      </div>
    );
  }

  const logo = config.logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/GBKP_logo.png/240px-GBKP_logo.png';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login gagal'); setLoading(false); return; }
      router.push('/admin/dashboard');
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 22, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,.5)', borderTop: '6px solid var(--red-deep)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logo} alt="GBKP" width={64} height={64} style={{ borderRadius: '50%', border: '3px solid var(--gold)', marginBottom: 12, objectFit: 'cover' }} />
          <h2 style={{ fontFamily: 'Cinzel,serif', color: 'var(--red-deep)', fontSize: '1.2rem', fontWeight: 700 }}>Admin GBKP</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: 4 }}>Tanjung Sari &mdash; Panel Admin</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fg">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username admin" required autoComplete="username" />
          </div>
          <div className="fg">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 16, padding: 4 }}
                tabIndex={-1}
              >
                <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 8, padding: '10px 14px', color: '#c0140a', fontSize: '.85rem', marginBottom: 16 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }} />{error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'var(--red-deep)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito,sans-serif', opacity: loading ? .7 : 1, transition: '.2s' }}>
            {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Masuk...</> : <><i className="fa-solid fa-right-to-bracket" /> Masuk</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '.78rem', color: 'var(--muted)' }}>
          <a href="/" style={{ color: 'var(--red-deep)', fontWeight: 700, textDecoration: 'none' }}>&larr; Kembali ke website</a>
        </p>
      </div>
    </div>
  );
}
