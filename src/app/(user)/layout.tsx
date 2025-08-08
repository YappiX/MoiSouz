import type { Metadata } from 'next';

import { ProfileLayout } from '@/components/layout/Profile';

export const metadata: Metadata = {};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
