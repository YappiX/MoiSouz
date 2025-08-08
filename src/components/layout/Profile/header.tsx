'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Container, IconButton } from '@mui/material';
import clsx from 'clsx';
import { ButtonFeedback, UserNav } from '@/components/entities/profile';
import styles from './header.module.scss';
import { Icon } from '@/components/ui';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import { getMyTU } from '@/services/getMyTU';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export const ProfileHeader = () => {
  const { info } = useFetchProfile();
  const router = useRouter();
  const [profileData, setProfileData] = useState(info);
  const [avatar, setAvatar] = useState();

  const { data: myTradeUnion } = useQuery({
    queryKey: ['myTradeUnion'],
    queryFn: getMyTU,
    select: (data) => data.data,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    if (info) setProfileData(info);
  }, [info]);

  const queryClient = useQueryClient();
  const path = usePathname();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['profile', 'myTradeUnion'] });
  }, [path]);

  useEffect(() => {
    setAvatar(
      profileData?.ROLES && profileData?.ROLES.length
        ? profileData?.ROLES.includes('ROLE_TRADEUNION')
          ? myTradeUnion?.logo
          : profileData?.avatar
        : undefined,
    );
  }, [profileData, myTradeUnion]);

  return (
    <Box component={'header'} className={clsx(styles.wrapper, styles.shadow)}>
      <Container className={clsx(styles.content)}>
        <Link href={'/main'}>
          <Image
            width={93}
            height={15}
            alt="Logo image"
            src="/images/Logo.svg"
          />
        </Link>

        <Box>
          <ButtonFeedback sx={{ mr: 0.5 }} />
          {/*<ButtonNotify count={0} />*/}
          <UserNav
            role={
              profileData?.ROLES && profileData?.ROLES.length
                ? profileData?.ROLES.includes('ROLE_TRADEUNION')
                  ? 'Владелец профсоюза'
                  : 'Пользователь'
                : undefined
            }
            name={
              profileData?.name && profileData?.name !== ' .'
                ? profileData?.name
                : myTradeUnion?.title || ''
            }
            avatar={avatar}
            sx={{ ml: 1 }}
          />
          <IconButton
            onClick={async () => {
              await signOut({ redirect: false });
              router.push('/signin');
            }}
          >
            <Icon color="primary" name="logout" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};
