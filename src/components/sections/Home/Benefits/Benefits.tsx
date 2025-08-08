'use client';

import React from 'react';
import s from './benefits.module.scss';
import { Box, Grid2, Typography } from '@mui/material';
import useMobile from '@/hooks/UseMobile';
import Image from 'next/image';

const Benefits = () => {
  const mobile = useMobile();
  return (
    <Box component={'section'} className={s.wrapper}>
      <Typography variant="h2" textTransform="uppercase" marginBottom={6.9}>
        ВЫГОДЫ ДЛЯ УЧАСТНИКА ПРОФСОЮЗА
      </Typography>
      <Grid2 container spacing={mobile ? 1.8 : 3.8} position={'relative'}>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'end'}
        >
          <Typography
            variant="h3"
            textTransform="uppercase"
            className={s.title}
            maxWidth={400}
          >
            РОСТ ДОХОДА И ЭКОНОМИЯ ДО 20 000 РУБЛЕЙ
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'start'}
        >
          <Typography variant="body1" className={s.text}>
            Повышение заработной платы и улучшение условий труда в организациях
            с сильным Профсоюзом. Маркетплейс предложений партнеров позволяет
            получить скидки и снизить стоимость товаров и услуг
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'end'}
        >
          <Typography
            variant="h3"
            textTransform="uppercase"
            maxWidth={292}
            className={s.title}
          >
            МИНИМУМ КОНФЛИКТОВ
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'start'}
        >
          <Typography variant="body1" className={s.text}>
            Снижение количества трудовых конфликтов и и увеличение скорости их
            разрешения с четким отслеживанием статуса работы по обращению
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'end'}
        >
          <Typography
            variant="h3"
            textTransform="uppercase"
            className={s.title}
            maxWidth={356}
          >
            РОСТ ДОВЕРИЯ К ПРОФСОЮЗУ
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'start'}
        >
          <Typography variant="body1" className={s.text}>
            Открытая и прозрачная система голосований и невозможность подделки
            результатов, повышают доверие к Профсоюзу и его лидерам
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'end'}
        >
          <Typography
            variant="h3"
            textTransform="uppercase"
            className={s.title}
            maxWidth={280}
          >
            ПОВЫШЕНИЕ ИНТЕРЕСА
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'start'}
        >
          <Typography variant="body1" className={s.text}>
            К общественной деятельности, рост инициативы и понимания
            результатов, которые возможно достигнуть за общественную работу в
            т.ч. за счет геймификации процесса
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'end'}
        >
          <Typography
            variant="h3"
            textTransform="uppercase"
            className={s.title}
            maxWidth={241}
          >
            СОЦИАЛЬНЫЙ ЛИФТ
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'start'}
        >
          <Typography variant="body1" className={s.text}>
            Для общественных активистов на основании подтверждённых результатов
            общественной деятельности и невозможности манипулирования фактами
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'end'}
        >
          <Typography
            variant="h3"
            textTransform="uppercase"
            className={s.title}
            maxWidth={210}
          >
            ЗАЩИТА ДАННЫХ
          </Typography>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          display={'flex'}
          justifyContent={mobile ? 'center' : 'start'}
        >
          <Typography variant="body1" className={s.text}>
            Персональные данные защищены в соответствии с требованиями
            законодательства
          </Typography>
        </Grid2>
        {!mobile && (
          <Image
            className={s.img}
            width={10}
            height={698}
            alt="Line"
            src="/images/line.svg"
          />
        )}
      </Grid2>
    </Box>
  );
};

export default Benefits;
