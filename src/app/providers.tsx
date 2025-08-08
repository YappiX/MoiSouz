'use client';

import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useColorScheme } from '@mui/material/styles';
import theme from '@/styles/theme';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { YMaps } from '@pbe/react-yandex-maps';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Providers = ({ children }: PropsWithChildren) => {
  const { setMode } = useColorScheme();
  setMode('light');
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const cache = React.useMemo(() => {
    return createCache({ key: 'css', prepend: true });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <YMaps>
            <SessionProvider>{children}</SessionProvider>
          </YMaps>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
};

export default Providers;
