'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from '@mui/material';

import { Icon } from '@/components/ui';
import {
  TradeUnionCard,
  Table,
  UploadUsersDialog,
} from '@/components/sections/Colleagues';

import { useFetchProfile } from '@/hooks/useFetchProfile';

import { useFetchUserTUs, useFetchTUUsers } from '@/hooks/useTU';
import { ITradeUnion } from '@/models/TradeUnion';
import { IFormColleagueProfile } from '@/models/Colleague';
import { deleteColleagueProfile } from '@/hooks/UseFormColleagueProfile';

const KEY_PARAM_ORGANIZATION = 'organization';

const ColleaguesWrapper = () => {
  const params = useSearchParams();
  const router = useRouter();

  const { info } = useFetchProfile();
  const {
    data: tuUsers,
    loading: loadingTUUsers,
    refetch: refetchTUUsers,
  } = useFetchTUUsers({ guid: params?.get(KEY_PARAM_ORGANIZATION) || '' });
  const tuList = useFetchUserTUs();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [userDelete, setUserDelete] = useState<IFormColleagueProfile | null>(
    null,
  );

  const tuActive: ITradeUnion | null = useMemo(
    () =>
      tuList?.find(
        (el) => el.guid == (params?.get(KEY_PARAM_ORGANIZATION) ?? -1),
      ) ?? null,
    [tuList, params],
  );

  useEffect(() => {
    if (tuActive != null) return;
    if (tuList == null) return;
    if (tuList.length == 0) return;
    handleClickTradeunion(tuList[0]);
  }, [tuList]);

  const handleClickTradeunion = (data: ITradeUnion) => {
    // unselect !?
    if (data.guid == tuActive?.guid) {
      //router.push(`${window.location.pathname}`);
      refetchTUUsers();
      return;
    }

    router.push(
      `${window.location.pathname}?${KEY_PARAM_ORGANIZATION}=${data.guid}`,
    );
    refetchTUUsers();
  };

  const handleClickUpload = () => {
    setOpenDialog(true);
  };

  const handleSuccessUpload = () => {
    refetchTUUsers();
  };

  const handleUserClick = (user: IFormColleagueProfile) => {
    router.push(`/colleagues/show/${user.guid}`);
  };

  const handleUserShow = (user: IFormColleagueProfile) => {
    router.push(`/colleagues/show/${user.guid}`);
  };

  const handleUserEdit = (user: IFormColleagueProfile) => {
    router.push(`/colleagues/edit/${user.guid}`);
  };

  const handleUserDelete = (user: IFormColleagueProfile) => {
    setUserDelete(user);
  };
  const handleUserDeleteAccept = async () => {
    if (userDelete == null) return;
    setUserDelete(null);
    await deleteColleagueProfile(userDelete);
    refetchTUUsers();
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1.5} marginTop={3}>
        <Typography variant="h3" marginBottom={2}>
          Коллеги
        </Typography>

        {tuList && (
          <Box display="flex" justifyContent="space-between" gap={1.5}>
            <Box display="flex" flexWrap="wrap" gap={1.5}>
              {tuList?.map((el) => (
                <TradeUnionCard
                  key={el.guid}
                  data={el}
                  count={tuUsers?.length}
                  onClick={handleClickTradeunion}
                  active={tuActive?.guid == el.guid}
                />
              ))}
            </Box>

            {tuActive && info?.hasTradeunionOwner && (
              <Box
                display="flex"
                flexDirection="column"
                minWidth="fit-content"
                marginTop="auto"
                gap={1.5}
              >
                <Link
                  href="/colleagues/create"
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
                      height: 'fit-content',
                      width: '100%',
                    }}
                  >
                    <Icon name="plus" color="secondary.main" />
                    Добавить участника
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  sx={{
                    gap: 1,
                    height: 'fit-content',
                    minWidth: 'fit-content',
                    marginTop: 'auto',
                  }}
                  onClick={handleClickUpload}
                >
                  <Icon name="upload" color="secondary.main" />
                  Загрузить участников
                </Button>
              </Box>
            )}
          </Box>
        )}

        {!loadingTUUsers ? (
          <Table
            users={(tuActive && tuUsers) || []}
            tradeunion={tuActive}
            owner={info?.hasTradeunionOwner}
            onClick={handleUserClick}
            onShow={handleUserShow}
            onEdit={handleUserEdit}
            onDelete={handleUserDelete}
          />
        ) : (
          <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      {info?.hasTradeunionOwner && (
        <UploadUsersDialog
          open={openDialog}
          defaultTradeUnion={tuActive}
          onClose={() => setOpenDialog(false)}
          onSuccess={handleSuccessUpload}
        />
      )}

      <Dialog
        open={Boolean(userDelete)}
        onClose={() => setUserDelete(null)}
        PaperProps={{
          sx: {
            p: 4,
            gap: 2,
          },
        }}
      >
        {userDelete && (
          <Typography fontSize={18} fontWeight={500} textAlign={'center'}>
            Удалить пользователя <b>{userDelete.name}</b>?
          </Typography>
        )}

        <Box display="flex" justifyContent="space-around">
          <Button
            variant="contained"
            sx={{
              bgcolor: 'red !important',
            }}
            onClick={handleUserDeleteAccept}
          >
            Удалить
          </Button>
          <Button onClick={() => setUserDelete(null)}>Отмена</Button>
        </Box>
      </Dialog>
    </>
  );
};

const ColleaguesPage = () => {
  return (
    <Suspense>
      <ColleaguesWrapper />
    </Suspense>
  );
};

export default ColleaguesPage;
