'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

import { PaginationSimple } from '@/components/ui';
import { NewsCardRow, NewsNotExists } from '@/components/sections/News';

import { useFetchNewsList } from '@/hooks/useNews';

const NewsListWrapper = () => {
  const perPage = 3;
  const {
    data: { data: list, isFetching: isLoading, page, total },
    actions: { loadPrev, loadNext },
  } = useFetchNewsList({
    type: 'page',
    status: 'published',
    perPage: perPage,
  });

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1.5} marginTop={3}>
        <Typography variant="h3">Новости</Typography>

        {list.map((el) => (
          <Link
            key={el.code}
            href={`/news/${el.code}`}
            style={{ display: 'flex' }}
          >
            <NewsCardRow data={el} />
          </Link>
        ))}

        <PaginationSimple
          page={page}
          perPage={perPage}
          total={total}
          loading={isLoading}
          onPrev={loadPrev}
          onNext={loadNext}
        />

        {!isLoading && list.length == 0 && <NewsNotExists />}
      </Box>
    </>
  );
};

const NewsListPage = () => {
  return (
    <Suspense>
      <NewsListWrapper />
    </Suspense>
  );
};

export default NewsListPage;
