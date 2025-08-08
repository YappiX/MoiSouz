import type { Metadata } from 'next';

import { MainLayout } from '@/components/layout/Main';

export const metadata: Metadata = {};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
