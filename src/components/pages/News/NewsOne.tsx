'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
//import Link from 'next/link';
import { Box, CircularProgress, Typography } from '@mui/material';

import { BreadCrumbsText } from '@/components/ui';
//import { NewsCardSimple } from '@/components/sections/News';

import { /*useFetchNewsList,*/ useFetchNewsOne } from '@/hooks/useNews';

const NewsOneWrapper = () => {
  const params = useParams();

  const { data: newsOne, isLoading: isLoadingNewsOne } =
    useFetchNewsOne(params);

  /*
  const {
    data: { data: newsList, isFetching: isLoading },
  } = useFetchNewsList({ status: 'published', perPage: 3 });
  */

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <BreadCrumbsText
        data={[
          { text: 'Главная', link: '/news/all' },
          { text: newsOne?.title || '' },
        ]}
      />

      <Typography variant="h3" lineHeight={'57px'}>
        Новости
      </Typography>

      {isLoadingNewsOne == false ? (
        <Box display="flex" gap={2}>
          <Box
            display="flex"
            flexDirection="column"
            bgcolor="white"
            borderRadius={5}
            overflow="hidden"
            width="80%"
            boxShadow="5px 5px 10px rgba(0,0,0,0.05)"
          >
            {newsOne?.image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${newsOne?.image}`}
                width={830}
                height={400}
                alt={newsOne?.title || ''}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                }}
              />
            )}

            <Box display="flex" flexDirection="column" gap={2} padding={2}>
              <Typography variant="h3" lineHeight={'57px'}>
                {newsOne?.title}
              </Typography>
              {/*newsOne?.tradeunions && newsOne?.tradeunions.length > 0 && (
                <Typography fontSize={22}>
                  {(newsOne?.tradeunions[0] as any).title}
                </Typography>
              )*/}
              <div
                className="html"
                dangerouslySetInnerHTML={{ __html: newsOne?.text || '' }}
              ></div>
            </Box>
          </Box>

          {/*
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width={300}
            minWidth={300}
          >
            {isLoading ? (
              <Box display={'flex'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
              </Box>
            ) : (
              newsList?.map((el) => (
                <Link
                  key={el.code}
                  href={`/news/${el.code}`}
                  style={{ display: 'flex' }}
                >
                  <NewsCardSimple data={el} />
                </Link>
              ))
            )}
          </Box>
          */}
        </Box>
      ) : (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

const NewsOnePage = () => {
  return (
    <Suspense>
      <NewsOneWrapper />
    </Suspense>
  );
};

export default NewsOnePage;
