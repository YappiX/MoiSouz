import { FC, PropsWithChildren } from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

import { Soon } from '@/components/ui';

import { PropsWithSX } from '@/models/Props';

interface Props {
  title: string;
  subTitle: string;
  description?: string;
  link?: {
    text?: string;
    to: string;
  };
  soon?: boolean;
}

export const MainSidebarCard: FC<PropsWithSX & PropsWithChildren & Props> = ({
  sx = {},
  children,
  title,
  subTitle,
  description,
  link,
  soon,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.4,
        width: '100%',
        bgcolor: 'white',
        borderRadius: 3.5,
        p: 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{title}</Typography>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          my: 2,
        }}
      >
        {children}
      </Box>

      <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{subTitle}</Typography>
      {description && (
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          {description}
        </Typography>
      )}
      {link && (
        <Link
          style={{ fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}
          href={link.to}
        >
          {link.text || 'Смотреть все'}
        </Link>
      )}

      {soon && <Soon />}
    </Box>
  );
};
