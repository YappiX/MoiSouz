'use client';

import React, { FC } from 'react';
import s from './card.module.scss';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { ITarrif } from '@/models/Tarrif';
import Link from 'next/link';

interface Props {
  noPrice?: boolean;
  isSoon?: boolean;
}

const CardItem: FC<ITarrif & Props> = ({
  title,
  price,
  priceDesc,
  price1,
  priceDesc1,
  list,
  desc,
  main,
  isActive,
  id,
  handleSubmit,
  noPrice,
  isSoon,
}) => {
  return (
    <Box className={main ? s.mainItem : s.item}>
      <Box className={s.cardHeader}>
        <Typography className={main ? s.mainPrice : s.price}>Тариф</Typography>
        <Typography className={main ? s.mainTitle : s.title}>
          {title}
        </Typography>
        {noPrice != true && (
          <>
            <Typography className={main ? s.mainPrice : s.price}>
              {price}
            </Typography>
            <Typography
              className={main ? s.mainDesc : s.desc}
              sx={{
                marginBottom:
                  title === '«ВОЗДУХ»' ? '42px !important' : '8px !important',
              }}
            >
              {priceDesc}
            </Typography>
            <Typography className={main ? s.mainPrice : s.price}>
              {price1}
            </Typography>
            <Typography className={main ? s.mainDesc : s.desc}>
              {priceDesc1}
            </Typography>
          </>
        )}
        <List className={s.list}>
          {list.map((item) => (
            <ListItem key={item} className={main ? s.mainL : s.l}>
              {item}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box className={s.cardFooter}>
        {desc && (
          <Typography
            className={main ? s.mainDesc2 : s.desc2}
            whiteSpace="break-spaces"
          >
            {desc}
          </Typography>
        )}
        {!isActive ? (
          <Link href="/registration" className={s.btn}>
            <Button
              variant={main ? 'outlined' : 'contained'}
              sx={{
                color: main ? 'rgb(72, 128, 255)' : '#fff',
                padding: '14px 17px',
                width: '100%',
                border: 'unset !important',
                outline: 'unset !important',
                boxShadow: 'unset !important',
                maxWidth: '180px',
                marginTop: 1.5,
              }}
            >
              {isSoon ? 'Скоро' : 'Оформить подписку'}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={() => handleSubmit && handleSubmit(id)}
            variant={main ? 'outlined' : 'contained'}
            sx={{
              color: main ? 'rgb(72, 128, 255)' : '#fff',
              padding: '14px 17px',
              width: '100%',
              border: 'unset !important',
              outline: 'unset !important',
              boxShadow: 'unset !important',
              maxWidth: '180px',
              marginTop: 1.5,
            }}
          >
            {isSoon ? 'Скоро' : 'Оформить подписку'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CardItem;
