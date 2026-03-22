export default function KaroDiv({ white }: { white?: boolean }) {
  const s = white ? { background: 'linear-gradient(90deg,var(--gold-2),rgba(255,255,255,.1))' } : undefined;
  const sr = white ? { background: 'linear-gradient(90deg,rgba(255,255,255,.1),var(--gold-2))' } : undefined;
  return (
    <div className="karo-div">
      <div className="kl" style={s} />
      <span className="ks" style={white ? { color: 'var(--gold-2)' } : undefined}>✦</span>
      <div className="kl" style={sr} />
    </div>
  );
}
