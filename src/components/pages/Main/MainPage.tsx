'use client';

import React, { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Link from 'next/link';

import { Soon } from '@/components/ui';
import {
  MainList,
  MainStatsCard,
} from '@/components/sections/Main';
import { NewsCardBig, NewsNotExists } from '@/components/sections/News';

import useScreen from '@/hooks/useScreen';
import { useFetchNewsList } from '@/hooks/useNews';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import { useQuery } from '@tanstack/react-query';
import { getDocs } from '@/services/getDocs';


const TASKS_ACTIVE = [
  { id: 1, title: 'Активная задача 1' },
  { id: 2, title: 'Активная задача 2' },
];

const TASKS_FUTURE = [
  { id: 1, title: 'Задача 1' },
  { id: 2, title: 'Задача 2' },
];

const Main = () => {
  const screen = useScreen();

  const gridTemplateColumns = useMemo(() => {
    switch (screen) {
      case 'mobile':
        return '1fr';
      case 'tablet':
        return '1fr 1fr';
    }
    return '1fr 1fr 1fr';
  }, [screen]);

  const {
    data: { data: newsList, isFetching: newsIsLoading },
  } = useFetchNewsList({
    type: 'page',
    status: 'published',
    perPage: 2,
  });

  const { info: profile, isLoading } = useFetchProfile();

  const { data: docs } = useQuery({
    queryKey: ['docs'],
    queryFn: getDocs,
    select: (data) => data,
  });

  const OWNER = profile?.hasTradeunionOwner;

  if (isLoading == true) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          paddingTop: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: 3,
      }}
    >
      {/* {<Typography variant="h3">Деньги</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns,
          gap: 2,
          marginTop: 2,
        }}
      >
        {OWNER ? (
          <MainStatsCard
            icon="stats-wallet"
            color="#FEC53D"
            title="Баланс"
            value="102340 ₽"
            percent={-4.3}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <MainStatsCardMini
              sx={{ width: '100%' }}
              icon="stats-wallet"
              color="#FEC53D"
              title="Баланс"
              value="10793 ₽"
            />
            <MainStatsCardMini
              sx={{ width: '100%' }}
              icon="stats-users"
              color="#8280FF"
              title="Взносы"
              value="107293 ₽"
            />
          </Box>
        )}

        <MainStatsCard
          icon="stats-diagram-to-up"
          color="#4AD991"
          title="Экономия"
          value="12340 ₽"
          percent={-4.3}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {OWNER ? (
            <MainStatsCardMini
              sx={{ width: '100%' }}
              icon="stats-users"
              color="#8280FF"
              title="Взносы"
              value="107293 ₽"
            />
          ) : (
            <MainStatsCardMini
              sx={{ width: '100%' }}
              icon="stats-wallet"
              color="#FEC53D"
              title="Пополнения"
              value="10293 ₽"
            />
          )}
          <MainStatsCardMini
            sx={{ width: '100%' }}
            icon="stats-reload"
            color="#FF9066"
            title="Расходы"
            value="6293 ₽"
          />
        </Box>
      </Box>} */}

      <Typography variant="h3">
        Документы
      </Typography>

      {OWNER && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns,
            gap: 2,
            marginTop: 2,
          }}
        >
          
          <MainStatsCard
            icon="stats-users"
            color="#8280FF"
            title="Заявлений о вступлении"
            value={docs && docs.length ? String(docs.filter((doc) => doc.
documentType === 'AM').length) : '0'}
            percent={0}
          />
          <MainStatsCard
            icon="stats-box"
            color="#4AD991"
            title="Обращений в организацию"
            value="0"
            percent={0}
            sx={{position: 'relative' }}
            soon
          />
          <MainStatsCard
            icon="stats-diagram-to-down"
            color="#FF9066"
            title="Заявлений о выходе"
            value="0"
            percent={0}
            sx={{position: 'relative' }}
            soon
          />
        </Box>
      )}

      {!OWNER && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns,
            gap: 2,
            marginTop: 2,
          }}
        >
          <MainStatsCard
            icon="stats-users"
            color="#8280FF"
            title="Обращений направлено"
            value="0"
            percent={0}
          />
          <MainStatsCard
            icon="stats-box"
            color="#4AD991"
            title="Ответов получено"
            value="0"
            percent={0}
          />
          <MainStatsCard
            icon="stats-diagram-to-down"
            color="#FF9066"
            title="Обращений на рассмотрении"
            value="0"
            percent={0}
          />
        </Box>
      )}

      {/*OWNER && (
        <>
          <MainList
            sx={{
              marginTop: 3,
            }}
          >
            <MainPendingStatus
              title="Нерассмотренные заявления"
              count={PENDING_APPLICATIONS}
            />
            <MainPendingStatus
              title="Нерассмотренные обращения"
              count={PENDING_REQUESTS}
            />
          </MainList>

          <Link
            style={{
              marginLeft: 25,
              marginTop: 10,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'underline',
            }}
            href="/documents"
          >
            Смотреть все
          </Link>
        </>
      )*/}

      <Typography variant="h3" marginTop={3}>
        Задачи
      </Typography>

      <MainList
        sx={{
          position: 'relative',
          marginTop: 2,
        }}
      >
        <Typography fontSize={14} fontWeight={700}>
          Активные задачи
        </Typography>
        {TASKS_ACTIVE.map((el) => (
          <Typography key={el.id} fontSize={14} fontWeight={600}>
            {el.title}
          </Typography>
        ))}

        <Soon />
      </MainList>

      <MainList
        sx={{
          position: 'relative',
          marginTop: 2,
        }}
      >
        <Typography fontSize={14} fontWeight={700}>
          Задачи на будущее
        </Typography>
        {TASKS_FUTURE.map((el) => (
          <Typography key={el.id} fontSize={14} fontWeight={600}>
            {el.title}
          </Typography>
        ))}

        <Soon />
      </MainList>

      <Link
        style={{
          marginLeft: 25,
          marginTop: 10,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'underline',
        }}
        href="/main"
      >
        Смотреть все
      </Link>

      <Typography variant="h3" marginTop={3}>
        Новости
      </Typography>

      {newsIsLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: 3,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {newsList.length > 0 && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: screen == 'mobile' ? '1fr' : '1fr 1fr',
                  marginTop: 2,
                  gap: 2,
                }}
              >
                {newsList.map((el) => (
                  <Link
                    key={el.code}
                    href={`/news/${el.code}`}
                    style={{
                      display: 'flex',
                    }}
                  >
                    <NewsCardBig data={el} />
                  </Link>
                ))}
              </Box>

              <Link
                style={{
                  marginLeft: 25,
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
                href="/news/all"
              >
                Смотреть все
              </Link>
            </>
          )}

          {newsList.length == 0 && <NewsNotExists />}
        </>
      )}
    </Box>
  );
};

export default Main;
