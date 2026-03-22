import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GBKP Runggun Tanjung Sari',
  description: 'Gereja Batak Karo Protestan Runggun Tanjung Sari — Klasis Medan Kampung Lalang',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
