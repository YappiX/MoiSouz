'use client';

import React, { FC, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

import {
  NewsCardBig,
  NewsCardSimple,
  NewsNotExists,
} from '@/components/sections/News';

import { useFetchNewsList } from '@/hooks/useNews';
import { chunkArray } from '@/utils/array';

import { IFormNews } from '@/models/News';

interface PropsNews {
  data: IFormNews[];
}

const Grid: FC<PropsNews> = ({ data }) => {
  const chunks = useMemo(() => chunkArray(data, 7), [data]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RowLeft data={(chunks && chunks[0]) || []} />
      {/*chunks.map((chunk, i) => (
        <Fragment key={i}>
          {i % 2 == 0 ? <RowLeft data={chunk} /> : <RowRight data={chunk} />}
        </Fragment>
      ))*/}
    </Box>
  );
};

const RowLeft: FC<PropsNews> = ({ data }) => {
  if (data.length == 0) return null;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 2 }}>
      <Link href={`/news/${data[0].code}`} style={{ display: 'flex' }}>
        <NewsCardBig sx={{ minHeight: '450px' }} data={data[0]} />
      </Link>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 2,
        }}
      >
        {data.slice(1).map((el) => (
          <Link
            key={el.code}
            href={`/news/${el.code}`}
            style={{ display: 'flex' }}
          >
            <NewsCardSimple data={el} />
          </Link>
        ))}
      </Box>
    </Box>
  );
};

/*
const RowRight: FC<PropsNews> = ({ data }) => {
  if (data.length == 0) return null;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 2,
        }}
      >
        {data.slice(0, -1).map((el) => (
          <Link
            key={el.code}
            href={`/news/${el.code}`}
            style={{ display: 'flex' }}
          >
            <NewsCardSimple data={el} />
          </Link>
        ))}
      </Box>
      <Link
        href={`/news/${data[data.length - 1].code}`}
        style={{ display: 'flex' }}
      >
        <NewsCardBig sx={{ minHeight: '450px' }} data={data[data.length - 1]} />
      </Link>
    </Box>
  );
};
*/

const NewsMainWrapper = () => {
  const {
    data: { data: newsList, isFetching: isLoading },
  } = useFetchNewsList({ status: 'published', perPage: 7 });

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1.5} marginTop={3}>
        <Typography variant="h3" marginBottom={2}>
          Новости
        </Typography>

        <Grid data={newsList} />

        {!isLoading && newsList.length > 0 && (
          <Link href="/news/all">
            <Button
              sx={{
                textDecoration: 'underline',
                justifyContent: 'start',
                maxWidth: 'fit-content',
              }}
              variant="text"
            >
              Смотреть все
            </Button>
          </Link>
        )}

        {isLoading && (
          <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && newsList.length == 0 && <NewsNotExists />}
      </Box>
    </>
  );
};

const NewsMainPage = () => {
  return (
    <Suspense>
      <NewsMainWrapper />
    </Suspense>
  );
};

export default NewsMainPage;
