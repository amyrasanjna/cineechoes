import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineEchoes Actress League',
  description: 'Vote your favorite Bollywood actress in the latest CineEchoes battle.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
