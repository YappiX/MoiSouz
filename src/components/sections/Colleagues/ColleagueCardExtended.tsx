'use client';

import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { TradeUnionCardSimple } from './TradeUnionCardSimple';

import { IFormColleagueProfile } from '@/models/Colleague';
import { useFetchTUOwner, useFetchTUs } from '@/hooks/useTU';

import { ITradeUnion } from '@/models/TradeUnion';
import { PropsWithStyle } from '@/models/Props';

interface PropsField {
  name: string;
  value?: string | number | null;
  big?: boolean;
}

const Field: FC<PropsWithStyle & PropsField> = ({
  style,
  name,
  value,
  big,
}) => {
  return (
    <Box
      display="flex"
      flexDirection={big ? 'column' : 'row'}
      gap={0.5}
      marginTop={1}
      style={style}
    >
      <Typography fontSize={14} fontWeight="bold">
        {name}
        {!big && ':'}
      </Typography>
      <Typography fontSize={14} fontWeight={600} color="darkgray">
        {value || '-'}
      </Typography>
    </Box>
  );
};

interface Props {
  user: IFormColleagueProfile;
}

export const ColleagueCardExtended: FC<Props> = ({ user }) => {
  const tuOwner = useFetchTUOwner();
  const tuList = useFetchTUs();
  const tradeunion: ITradeUnion | undefined = useMemo(
    () =>
      tuOwner && tuList?.data
        ? tuList.data.find((el) => el.guid == tuOwner?.guid)
        : undefined,
    [tuOwner, tuList],
  );

  if (user == null) return null;

  dayjs.extend(customParseFormat);

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="white"
      borderRadius={4}
      overflow="hidden"
      boxShadow="5px 5px 30px rgba(0,0,0,0.2)"
      padding={2}
    >
      <Box display="flex" justifyContent="space-between">
        {tradeunion && <TradeUnionCardSimple data={tradeunion} />}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="end"
          marginLeft="auto"
          marginBottom={2}
        >
          <Typography fontSize={14} fontWeight="bold">
            Уникальный номер участника МойСоюз
          </Typography>
          <Typography fontSize={14} fontWeight={600} color="darkgray">
            {user.card?.match(/.{1,4}/g)?.join(' ')}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Box>
          <Field
            name="ФИО"
            value={[user.firstName, user.lastName, user.middleName]
              .filter((el) => el)
              .join(' ')}
          />

          <Field name="Номер участника профсоюза" value={user.code} />

          <Field
            name="Специальность по образованию"
            value={user.profession && user.profession[0]}
          />

          <Field name="Дата рождения" value={user.birthdate} />

          <Field name="Образование" value={user.education} />

          <Field name="Дата вступления в Профсоюз" value={user.invitedAt} />

          <Field name="Дата заполнения карточки" value={user.updatedAt} />

          <Field name="Роль" value={user.role} />
        </Box>

        {user.avatar && (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
              user.avatar as string
            }`}
            width={128}
            height={172}
            style={{ objectFit: 'cover', borderRadius: 10 }}
            alt=""
          />
        )}
      </Box>

      {tradeunion && (
        <Field
          name="Наименование первичной профсоюзной организации, выдавшей профсоюзную карточку"
          value={tradeunion?.title}
          big
        />
      )}

      {tradeunion?.address && (
        <Field
          name="Адрес первичной профсоюзной организации"
          value={[
            tradeunion?.address?.city,
            `${tradeunion?.address?.street} ${tradeunion?.address?.house}`,
            tradeunion?.address?.flat,
          ]
            .filter((el) => el != null && el.trim().length > 0)
            .join(', ')}
          big
        />
      )}

      <Box display="flex">
        <Field
          style={{
            flex: 1,
          }}
          name="Занимаемая должность"
          value={user.position && user.position[0]}
          big
        />
        <Field
          style={{
            flex: 1,
          }}
          name="Домашний адрес"
          value={[
            user?.address?.locality,
            `${user?.address?.street || ''} ${user?.address?.house || ''}`,
            user?.address?.flat,
          ]
            .filter((el) => el != null && el.trim().length > 0)
            .join(', ')}
          big
        />
      </Box>
      <Box display="flex">
        <Field
          style={{
            flex: 1,
          }}
          name="Контактный телефон"
          value={user.phone}
          big
        />

        <Field
          style={{
            flex: 1,
          }}
          name="Адрес электронной почти"
          value={user.email}
          big
        />
      </Box>

      {/*user.history && user.history.length > 0 && (
        <Typography fontSize={16} fontWeight="bold" marginTop={4}>
          История участия в профсоюзных организациях
        </Typography>
      )*/}

      {/*user.history?.map((el, i) => (
        <Box key={`history-${i}`} marginTop={2}>
          <Field name="Название организации" value={el.name} big />
          <Field name="Дата принятия" value={el.startDate} />
          <Field name="Дата выхода" value={el.finishDate} />
        </Box>
      ))*/}
    </Box>
  );
};
