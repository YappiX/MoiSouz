import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { MainSidebarCard } from './sidebar-card';
import { Icon } from '@/components/ui';

export const MainSidebar: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MainSidebarCard
        title="Достижения"
        subTitle="Название достижения"
        link={{
          to: '/main',
        }}
        soon
      >
        <Icon name="star" color="#FFD56D" />
      </MainSidebarCard>
      <MainSidebarCard
        title="Блок проекта"
        subTitle="Новинки в сервисе"
        description="29.07.2024"
        soon
      >
        <Icon name="stats-diagram-ring" />
        <Typography
          sx={{ position: 'absolute', fontSize: 18, fontWeight: 700 }}
        >
          Часы
        </Typography>
      </MainSidebarCard>
    </Box>
  );
};
