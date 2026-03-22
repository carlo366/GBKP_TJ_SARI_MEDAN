'use client';
import { useState, useEffect } from 'react';

export interface SiteConfig {
  pagiMulai: string;
  pagiSelesai: string;
  pagiBahasa: string;
  soreMulai: string;
  soreSelesai: string;
  soreBahasa: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
  mapsEmbed: string;
  logoUrl: string;
}

export const defaultConfig: SiteConfig = {
  pagiMulai: '08.00',
  pagiSelesai: '10.30',
  pagiBahasa: 'Bahasa Karo / Indonesia',
  soreMulai: '17.00',
  soreSelesai: '19.00',
  soreBahasa: 'Bahasa Indonesia',
  alamat: 'GJVF+3R3, Sempakata, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20133',
  telepon: '',
  whatsapp: '',
  email: 'gbkptanjungsari@gmail.com',
  mapsUrl: 'https://www.google.com/maps/place/GBKP+Tanjung+Sari/@3.5431815,98.6246419,19z/data=!4m6!3m5!1s0x30312f87a64539d7:0xcb68077110b05047!8m2!3d3.5426388!4d98.6245348!16s%2Fg%2F11cny2_wmp',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.9!2d98.6245348!3d3.5426388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312f87a64539d7%3A0xcb68077110b05047!2sGBKP%20Tanjung%20Sari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  logoUrl: '/logo-gbkp.png',
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(d => { setConfig({ ...defaultConfig, ...d }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { config, loading };
}
