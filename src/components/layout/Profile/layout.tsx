import type { Metadata } from 'next';
import { Box, Container } from '@mui/material';

import { ProfileAside, ProfileHeader } from '@/components/layout/Profile';

import styles from './layout.module.scss';

export const metadata: Metadata = {};

export const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Box className={styles.wrapper} sx={{ backgroundColor: 'secondary.main' }}>
      <ProfileHeader />
      <Container className={styles.content}>
        <ProfileAside />
        <Box sx={{ flex: 1, p: 2 }}>{children}</Box>
      </Container>
    </Box>
  );
};
