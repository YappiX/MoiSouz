import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import CookieRequest from '@/components/sections/Home/CookieRequest/CookieRequest';

const nunitoSans = Nunito_Sans({
  subsets: ['cyrillic', 'latin'],
  weight: ['200', '300', '400', '600', '700', '800'],
  variable: '--font-nunito',
  style: ['normal'],
  display: 'swap',
});

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <meta name="color-scheme" content="only light"></meta>
      <body className={nunitoSans.className}>
        <Providers>{children}</Providers>
        <CookieRequest />
      </body>
    </html>
  );
}
