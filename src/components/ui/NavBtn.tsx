'use client';

import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';

import { Icon } from '@/components/ui/Icon';

import s from './scrollbtn.module.scss';

const ScrollButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  return (
    <Fab
      variant="extended"
      color="primary"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      sx={{
        display: showButton ? 'block' : 'none',
        opacity: showButton ? 1 : 0,
      }}
      className={s.btn}
    >
      <Icon name="arrow-up" color="white" />
    </Fab>
  );
};

export default ScrollButton;
