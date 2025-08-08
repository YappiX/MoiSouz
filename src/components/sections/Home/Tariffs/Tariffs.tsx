'use client';

import { Box, Button, Grid2, List, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import s from './tarrifs.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { items } from '@/constants/tarrifs';
import CardItem from './Card/Card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTariffs, sendTariffs } from '@/services/getTariffs';
import { ITarrif } from '@/models/Tarrif';
import NewProfileDialog from '@/components/entities/profile/newProfileDialog';
import { useRouter } from 'next/navigation';

interface Props {
  noTitle?: boolean;
  noPrice?: boolean;
  isSoon?: boolean;
  isActive?: boolean;
}

const Tariffs = ({ noTitle, noPrice, isSoon, isActive }: Props) => {
  const { data } = useQuery({
    queryKey: ['tariffs'],
    queryFn: getTariffs,
    select: (data) => data.data.data,
  });

  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isSuccess } = useMutation({
    mutationFn: (id: number | undefined) => sendTariffs(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleSubmit = (id: number | undefined) => mutate(id);

  useEffect(() => {
    if (isSuccess) {
      setOpen(true);
    }
  }, [isSuccess]);

  const router = useRouter();

  return (
    <Box component={'section'} className={s.wrapper}>
      {!noTitle && (
        <Typography variant="h2" textTransform="uppercase" marginBottom={4.3}>
          Тарифы
        </Typography>
      )}
      <Box className={s.infoBox}>
        <Box className={s.textBox}>
          <Image
            width={148}
            height={125}
            alt="Truck"
            src="/images/free-shipping--e-commerce-free-shipping.svg"
          />
          <Box>
            <Typography className={s.price}>Тариф</Typography>
            <Typography variant="h3" textTransform="uppercase">
              «Элементарный»
            </Typography>
            {noPrice != true && (
              <>
                <Typography className={s.price}>9,9 рублей</Typography>
                <Typography
                  className={s.desc}
                  sx={{ marginBottom: '8px !important' }}
                >
                  за пользователя в месяц
                </Typography>
                {/*
                <Typography className={s.price}>4,9 рублей</Typography>
                <Typography className={s.desc}>при оплате за год</Typography>
                */}
              </>
            )}
          </Box>
        </Box>
        <List>
          <Typography>
            - Учет участников Профсоюза и Единый цифровой паспорт участника
          </Typography>
          <Typography>
            - Формирование и ведение учетной карточки члена Профсоюза
          </Typography>
          <Typography>
            - Возможность работы в одном ЛК по нескольким организациям
          </Typography>
          <Typography>- Защита персональных данных</Typography>
          <Typography>- Реклама от партнеров</Typography>
        </List>
        {!isActive ? (
          <Link
            href={'/registration'}
            style={{ maxWidth: '180px', width: '100%' }}
          >
            <Button
              variant="contained"
              sx={{ padding: '12px 17px', minWidth: '20%' }}
            >
              Оформить подписку
            </Button>
          </Link>
        ) : (
          <Button
            variant="contained"
            sx={{ padding: '12px 17px', minWidth: '20%' }}
            onClick={() =>
              handleSubmit(
                data
                  ? data.find(
                      (el: ITarrif) => el.title === 'Тариф «Элементарный»',
                    ).id
                  : undefined,
              )
            }
          >
            Оформить подписку
          </Button>
        )}
      </Box>
      <Grid2 container spacing={2.5}>
        {items.map((item, i) => (
          <Grid2 key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <CardItem
              id={
                data
                  ? data.find(
                      (el: ITarrif) => el.title.split(' ')[2] === item.title,
                    ).id
                  : undefined
              }
              isActive={isActive}
              noPrice={noPrice}
              isSoon={isSoon && i > 0}
              title={item.title}
              price={item.price}
              priceDesc={item.priceDesc}
              price1={item.price1}
              priceDesc1={item.priceDesc1}
              list={item.list}
              desc={item.desc}
              main={item.main}
              handleSubmit={handleSubmit}
              isSuccess={isSuccess}
            />
          </Grid2>
        ))}
      </Grid2>
      <NewProfileDialog
        open={open}
        title={
          'Спасибо за выбор тарифа! Наш менеджер свяжется с Вами для уточнения деталей активации. В период оформления выбранного тарифа Вам бесплатно подключен тариф "Элементарный" на 14 дней'
        }
        link={'/documents?incoming'}
        btn={'Закрыть'}
        onClose={() => {
          router.push('/documents?incoming');
        }}
      ></NewProfileDialog>
    </Box>
  );
};

export default Tariffs;
