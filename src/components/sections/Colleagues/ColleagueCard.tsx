'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

import { IFormColleagueProfile } from '@/models/Colleague';

interface Props {
  user: IFormColleagueProfile;
}

export const ColleagueCard: FC<Props> = ({ user }) => {
  if (user == null) return null;

  return (
    <Box
      display="flex"
      bgcolor="white"
      borderRadius={4}
      overflow="hidden"
      height={250}
      boxShadow="5px 5px 30px rgba(0,0,0,0.2)"
    >
      {user.avatar && (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.avatar as string}`}
          width={300}
          height={250}
          style={{ objectFit: 'cover' }}
          alt=""
        />
      )}
      <Box display="flex" flex={1}>
        <Box display="flex" flexDirection="column" flex={1} p={2}>
          <Typography fontSize={16} fontWeight={700}>
            {[user?.lastName, user?.firstName, user?.middleName]
              .filter((el) => el)
              .join(' ')}
          </Typography>
          <Typography fontSize={14} color="gray">
            {user?.education && user?.education}
          </Typography>
          <Typography fontSize={14} color="gray">
            {user?.position && user?.position[0]}
          </Typography>
          <Typography fontSize={14} color="gray">
            {user?.profession && user?.profession[0]}
          </Typography>
          {/*
          <Box marginTop="auto" marginBottom="auto">
            <Typography fontSize={14} color="gray">
              {user?.email}
            </Typography>
            <Typography fontSize={14} color="gray">
              {user?.phone}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              gap: 2,
              paddingX: 2,
              paddingY: 1,
              width: 'fit-content',
              borderRadius: 2,
              borderColor: 'gray !important',
            }}
          >
            <Icon name="mail" color="gray" />
            <Typography fontSize={14} fontWeight={700} color="gray">
              Связаться
            </Typography>
          </Button>
          */}
        </Box>
        <Box width="fit-content" p={2} textAlign="right">
          <Box display="flex" flexDirection="column" alignItems="end">
            <Typography fontSize={14} fontWeight="bold">
              Уникальный номер участника МойСоюз
            </Typography>
            <Typography fontSize={14} fontWeight={600} color="darkgray">
              {user.card?.match(/.{1,4}/g)?.join(' ')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
