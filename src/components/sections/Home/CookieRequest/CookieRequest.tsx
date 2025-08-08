'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import s from './CookieRequest.module.scss';

const KEY_STORAGE = 'cookie-requested';

const CookieRequest = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const state = localStorage.getItem(KEY_STORAGE);
    if (state == 'true') return;
    setVisible(true);
  }, []);

  const handleClick = () => {
    setVisible(false);
    localStorage.setItem(KEY_STORAGE, 'true');
  };

  if (visible == false) return null;
  return (
    <Box component="section" className={s.wrapper}>
      <Typography className={s.text}>
        Используя данный сайт, вы даёте согласие на использование файлов cookie,
        помогающих нам сделать его удобнее для вас.
      </Typography>

      <Button variant="text" className={s.btn} onClick={handleClick}>
        Согласиться
      </Button>
    </Box>
  );
};

export default CookieRequest;
