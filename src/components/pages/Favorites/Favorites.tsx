'use client';

import { BenefitsProduct } from '@/components/sections/Benefits';
import { BreadCrumbsText } from '@/components/ui';
import useScreen from '@/hooks/useScreen';
import { FavoriteType } from '@/models/Favorites';
import { useFetchFavorites } from '@/services/favorites';
import { Box, CircularProgress, Grid2, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

interface Props {
  type?: FavoriteType;
  breadcrumb?: {
    text: string;
    link: string;
  };
}

const FavoritesPage = ({ type, breadcrumb }: Props) => {
  const screen = useScreen();

  const {
    data: { data, isLoading },
  } = useFetchFavorites({ type });

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <BreadCrumbsText
        data={[
          { text: 'Главная', link: '/main' },
          breadcrumb,
          { text: 'Избранное' },
        ].filter((el) => el != null)}
      />

      <Typography variant="h3" lineHeight={'57px'}>
        Избранное
      </Typography>

      {!isLoading ? (
        <Grid2 container spacing={2}>
          {data && data.length > 0 ? (
            <Box
              position="relative"
              display="flex"
              justifyContent={data.length > 2 ? 'space-between' : ''}
              flexWrap="wrap"
              width="100%"
              gap={1.5}
            >
              {data.map((el) => (
                <Link
                  key={el.id}
                  href={el.source}
                  style={{
                    display: 'flex',
                    flex:
                      screen == 'mobile'
                        ? '100%'
                        : screen == 'tablet'
                          ? 'calc(50% - 8px)'
                          : 'calc(33% - 8px)',
                    maxWidth:
                      screen == 'mobile'
                        ? '100%'
                        : screen == 'tablet'
                          ? 'calc(50% - 8px)'
                          : 'calc(33% - 8px)',
                    width: '100%',
                  }}
                >
                  <BenefitsProduct
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data={{ ...el.data, image_url: el.data.image } as any}
                  />
                </Link>
              ))}
            </Box>
          ) : (
            <Typography variant="h3">Здесь пока пусто</Typography>
          )}
        </Grid2>
      ) : (
        <CircularProgress></CircularProgress>
      )}
    </Box>
  );
};

export default FavoritesPage;
