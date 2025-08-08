'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Button, Dialog, Typography } from '@mui/material';

import { Icon, /*InputAutocomplete,*/ PaginationSimple } from '@/components/ui';
import { Table } from '@/components/sections/News';

import { useFetchTUOwner } from '@/hooks/useTU';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import {
  canEditNews,
  deleteFormNews,
  pathNewsOne,
  useFetchNewsList,
} from '@/hooks/useNews';

import { IFormNews } from '@/models/News';
import { IOptionValue } from '@/models/Option';
import { ITradeUnion } from '@/models/TradeUnion';

//import { OPTIONS_NEWS_STATUS } from '@/constants/options';

const KEY_PARAM_STATUS = 'status';

const NewsEditListWrapper = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<IOptionValue | null>(
    params.get(KEY_PARAM_STATUS),
  );

  const tuOwner = useFetchTUOwner();
  const { info } = useFetchProfile();
  const perPageNewsList = 9;
  const {
    data: {
      data: newsList,
      isFetching: isLoading,
      page: pageNewsList,
      total: totalNewsList,
    },
    actions: {
      loadPrev: loadPrevNewsList,
      loadNext: loadNextNewsList,
      refetch: refetchNewsList,
    },
  } = useFetchNewsList({
    type: 'page',
    prename: 'edit',
    perPage: perPageNewsList,
    status,
  });

  const [newsDelete, setNewsDelete] = useState<IFormNews | null>(null);
  const [newsLoading, setNewsLoading] = useState<IFormNews[]>([]);

  useEffect(() => {
    refetchNewsList();
  }, []);

  useEffect(() => {
    setStatus(params.get(KEY_PARAM_STATUS));
  }, [params]);

  /*
  const handleChangeStatus = (value: IOptionValue | null) => {
    if (status == value) return;

    if (value != null)
      router.push(`${window.location.pathname}?${KEY_PARAM_STATUS}=${value}`);
    else router.push(`${window.location.pathname}`);

    setStatus(value);
    refetchNewsList();
  };
  */

  const handleClick = (newsOne: IFormNews) => {
    if (canEditNews(newsOne, tuOwner as ITradeUnion)) {
      router.push(`/news/edit/${newsOne.code}`);
      return;
    }
    handleShow(newsOne);
  };

  const handleShow = (newsOne: IFormNews) => {
    window.open(`/news/${newsOne.code}`, '_blank');
  };

  const handleEdit = (newsOne: IFormNews) => {
    if (canEditNews(newsOne, tuOwner as ITradeUnion)) {
      router.push(`/news/edit/${newsOne.code}`);
      return;
    }
    handleShow(newsOne);
  };

  const handleDelete = (newsOne: IFormNews) => {
    if (canEditNews(newsOne, tuOwner as ITradeUnion)) {
      setNewsDelete(newsOne);
    }
  };
  const handleNewsDeleteAccept = async () => {
    if (newsDelete == null) return;
    setNewsDelete(null);
    setNewsLoading((prev) => [...prev, newsDelete]);
    try {
      await deleteFormNews(newsDelete);
      await refetchNewsList();
    } catch {}
    setNewsLoading((prev) => prev.filter((el) => el.id != newsDelete.id));
  };

  const handleIsActive = async (newsOne: IFormNews) => {
    setNewsLoading((prev) => [...prev, newsOne]);
    try {
      await pathNewsOne(newsOne.code || '', { isActive: !newsOne.isActive });
      await refetchNewsList();
    } catch {}
    setNewsLoading((prev) => prev.filter((el) => el.id != newsOne.id));
  };

  const handleIsMain = async (newsOne: IFormNews) => {
    setNewsLoading((prev) => [...prev, newsOne]);
    try {
      await pathNewsOne(newsOne.code || '', { isMain: !newsOne.isMain });
      await refetchNewsList();
    } catch {}
    setNewsLoading((prev) => prev.filter((el) => el.id != newsOne.id));
  };

  if (info == null || info?.hasTradeunionOwner == false) return null;
  return (
    <>
      <Box display="flex" flexDirection="column" gap={1.5} marginTop={3}>
        {newsList && (
          <Box display="flex" justifyContent="space-between" gap={1.5}>
            {/*
            <InputAutocomplete
              sx={{ width: 250 }}
              options={OPTIONS_NEWS_STATUS}
              placeholder="Все"
              value={status}
              onChange={handleChangeStatus}
            />
            */}
            <Typography variant="h3">Новости</Typography>

            {info?.hasTradeunionOwner && (
              <Box display="flex" flexDirection="column" minWidth="fit-content">
                <Link
                  href="/news/create"
                  style={{
                    gap: 1,
                    height: 'fit-content',
                    width: '100%',
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      gap: 1,
                      width: '100%',
                    }}
                  >
                    <Icon name="plus" color="secondary.main" />
                    Создать новость
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        )}

        <Table
          news={newsList || []}
          newsLoading={newsLoading}
          owner={info?.hasTradeunionOwner}
          onClick={handleClick}
          onShow={handleShow}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeIsActive={handleIsActive}
          onChangeIsMain={handleIsMain}
        />

        <PaginationSimple
          page={pageNewsList}
          perPage={perPageNewsList}
          total={totalNewsList}
          loading={isLoading}
          onPrev={loadPrevNewsList}
          onNext={loadNextNewsList}
        />
      </Box>

      <Dialog
        open={Boolean(newsDelete)}
        onClose={() => setNewsDelete(null)}
        PaperProps={{
          sx: {
            p: 4,
            gap: 2,
          },
        }}
        disableScrollLock
      >
        {newsDelete && (
          <Typography fontSize={18} fontWeight={500} textAlign={'center'}>
            Удалить новость <b>{newsDelete.title}</b>?
          </Typography>
        )}

        <Box display="flex" justifyContent="space-around">
          <Button
            variant="contained"
            sx={{
              bgcolor: 'red !important',
            }}
            onClick={handleNewsDeleteAccept}
          >
            Удалить
          </Button>
          <Button onClick={() => setNewsDelete(null)}>Отмена</Button>
        </Box>
      </Dialog>
    </>
  );
};

const NewsEditListPage = () => {
  return (
    <Suspense>
      <NewsEditListWrapper />
    </Suspense>
  );
};

export default NewsEditListPage;
