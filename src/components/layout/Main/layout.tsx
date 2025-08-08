import type { Metadata } from 'next';
import { Box } from '@mui/material';

import { MainSidebar } from './sidebar';

export const metadata: Metadata = {};

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Box sx={{ width: 300 }}>
        <MainSidebar />
      </Box>
    </Box>
  );
};
