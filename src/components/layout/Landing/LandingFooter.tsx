import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import s from './layout.module.scss';
import Image from 'next/image';

const LandingFooter = () => {
  return (
    <Box component="footer" className={s.footer}>
      <Container>
        <Box className={s.footerBox}>
          <Box className={s.footerList}>
            {/*
            <Typography component="a" href={`tel:+79052207677`} variant="body2">
              +79052207677
            </Typography>
            */}
            <Typography
              component="a"
              href={`mailto:info@profsouz24.ru`}
              variant="body2"
            >
              info@profsouz24.ru
            </Typography>
          </Box>
          <Box>
            <Image
              width={93}
              height={15}
              alt="Logo image"
              src="/images/Logo.svg"
            />
          </Box>
          <Box className={s.footerList}>
            <a href={`/User_agreement.pdf`} target="_blank">
              <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                Пользовательское соглашение
              </Typography>
            </a>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingFooter;
