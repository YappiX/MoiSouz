'use client';

import { BreadCrumbsText, Icon } from '@/components/ui';
import { useGetProfileInfo } from '@/hooks/UseGetProfileInfo';
import { useMap } from '@/hooks/useMap';
import {
  getBenefitsProduct,
  getBenefitsProductPromo,
} from '@/services/benefits';
import { useFavorite, useFetchFavorites } from '@/services/favorites';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid2,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { useYMaps } from '@pbe/react-yandex-maps';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const BenefitsProductPage = () => {
  const pathName = usePathname();
  const id = pathName.split('/')[3];
  const info = useGetProfileInfo();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openChoice, setOpenChoice] = useState<boolean>(false);
  const [selectedPlacemark, setSelectedPlacemark] = useState<null | number>(
    null,
  );

  const { data: product, isFetching } = useQuery({
    queryKey: ['benefit-item'],
    queryFn: () => getBenefitsProduct(id),
    select: (data) => data?.data.data,
  });
  const { data: promo, isFetching: isPromoFetching } = useQuery({
    queryKey: ['benefit-item-promo', currentId],
    queryFn: () => {
      if (!currentId) throw new Error('ID не указан');
      return getBenefitsProductPromo(currentId);
    },
    select: (data) => data?.data,
    enabled: !!currentId,
  });

  // FAVORITE - START
  const {
    data: { data: favorites, isLoading: isLoadingFavorites },
    actions: { refetch: refetchFavorites },
  } = useFetchFavorites({ type: 'benefits' });

  const {
    data: { isLoading: isLoadingFavorite },
    actions: { add: addFavorite, remove: removeFavorite },
  } = useFavorite();

  const dataFavorite = useMemo(() => {
    if (product == null) return null;
    if (favorites == null) return null;
    return favorites.find((el) => el.data.id == product.id);
  }, [product, favorites]);

  const handleClickFavorite = async () => {
    if (dataFavorite == null)
      await addFavorite({
        title: product.name,
        data: {
          type: 'benefits',
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.image_url || `data:image/png;base64,${product.image}`,
        },
        source: `/benefits/product/${product.id}`,
      });
    else await removeFavorite(dataFavorite.id);
    await refetchFavorites();
  };
  // FAVORITE - END

  const handleClick = (id: string) => {
    setCurrentId(id);
    handleCloseChoice();
  };

  const handleClickChoice = () => {
    setOpenChoice(true);
  };
  const handleCloseChoice = () => {
    setOpenChoice(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const mapRef = useRef(null);
  const ymaps = useYMaps([
    'Map',
    'Placemark',
    'control.ZoomControl',
    'templateLayoutFactory',
  ]);

  useMap(product, ymaps, mapRef, selectedPlacemark, setSelectedPlacemark);

  useEffect(() => {
    const container = document.querySelector<HTMLElement>('.description');
    function getElementByText(text: string) {
      const xpath = `//node()[normalize-space(text())='${text.trim()}']`;
      return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
    }
    const links = container
      ? [
          ...container.querySelectorAll<HTMLElement>('a span'),
          getElementByText('BestBenefits'),
        ]
      : [];
    if (links[links.length - 1] == null) links.pop();
    if (links.length)
      links.forEach((el) => {
        //@ts-expect-error none
        el.style.color = 'rgb(72, 128, 255)';
      });
  }, [product, id]);

  useEffect(() => {
    if (promo && promo.status == 'success') setOpen(true);
  }, [promo]);

  useEffect(() => {
    if (
      info.profileInfo?.ROLES?.length === 1 &&
      !info.profileInfo?.hasTradeunionMember
    )
      setOpenAlert(true);
  }, [info.profileInfo?.ROLES, info.profileInfo?.hasTradeunionMember]);

  useEffect(() => {
    if (open || openChoice) {
      document.body.style.paddingRight = '0';
      document.body.style.height = '100vh';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.height = '';
    }
  }, [open, openChoice]);

  return (
    <Grid2 container spacing={1.6}>
      {!isFetching ? (
        <>
          <BreadCrumbsText
            data={[
              { text: 'Скидки и льготы', link: '/benefits' },
              {
                text: product.main_category.name || '',
                link: `/benefits?category=${product.main_category.id}`,
              },
              { text: product.name || '' },
            ]}
          />
          <Grid2 size={12}>
            <Typography variant="h3" marginBottom={0}>
              {product.name}
            </Typography>
          </Grid2>
          <Grid2 size={12}>
            <Paper sx={{ padding: '0' }}>
              <img
                style={{
                  width: '100%',
                  borderRadius: '14px 14px 0 0',
                  objectFit: 'contain',
                }}
                alt={product.name}
                src={`data:image/png;base64,${product.image}`}
              />
              <Box p={2.4}>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
              </Box>
              {!!product.coords.length && (
                <Box padding={'0 20px 20px 20px'}>
                  <Typography variant="h3" fontWeight={600} marginTop="12px">
                    На карте
                  </Typography>
                  <div
                    style={{
                      height: '500px',
                      width: '100%',
                      marginTop: '24px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                    }}
                    ref={mapRef}
                  ></div>
                </Box>
              )}
              {info.profileInfo?.hasTradeunionMember && (
                <Box
                  padding={'0 20px 20px 20px'}
                  display="flex"
                  justifyContent={'center'}
                  gap={2}
                >
                  {product.options && product.options.length ? (
                    <Button
                      variant="contained"
                      sx={{ width: '175px', height: '50px' }}
                      onClick={handleClickChoice}
                    >
                      Выбрать
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleClick(id)}
                      disabled={isPromoFetching}
                      sx={{ width: '175px', height: '50px' }}
                    >
                      {isPromoFetching ? (
                        <CircularProgress></CircularProgress>
                      ) : (
                        'Получить'
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => handleClickFavorite()}
                    disabled={isLoadingFavorite || isLoadingFavorites}
                    sx={{ width: '210px', height: '50px' }}
                  >
                    {isLoadingFavorite || isLoadingFavorites ? (
                      <CircularProgress></CircularProgress>
                    ) : dataFavorite ? (
                      'Удалить из избранного'
                    ) : (
                      'В избранное'
                    )}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid2>
        </>
      ) : (
        <Box display={'flex'} width={'100%'} justifyContent={'center'}>
          <CircularProgress />
        </Box>
      )}
      {openAlert && (
        <Dialog
          open={openAlert}
          onClose={handleCloseAlert}
          sx={{
            '& .MuiPaper-root': {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingTop: '54px',
            },
          }}
        >
          {' '}
          <IconButton
            onClick={handleCloseAlert}
            sx={{ position: 'absolute', top: '16px', right: '16px' }}
          >
            <Icon name="close" color="#000" />
          </IconButton>
          <Typography variant="h3" textAlign={'center'} marginBottom={'12px'}>
            Для получения промокода необходимо вступить в Профсоюз
          </Typography>
          <Button
            component={'a'}
            variant="contained"
            href="/trade_union_member"
          >
            К заявлению
          </Button>
        </Dialog>
      )}
      {promo && promo.status == 'success' && (
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              width: '390px',
              height: '275px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            },
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: '16px', right: '16px' }}
          >
            <Icon name="close" color="#000" />
          </IconButton>
          <img
            alt="promoSuccess"
            src="/images/promo.svg"
            width={'74px'}
            height={'71px'}
          ></img>
          <Typography variant="h3">Промокод получен!</Typography>
          <Typography variant="h3">{promo.data.code}</Typography>
          <Button component={'a'} variant="contained" href="/promo">
            Посмотреть
          </Button>
        </Dialog>
      )}
      {openChoice && product.options && (
        <Dialog
          open={openChoice}
          onClose={handleCloseChoice}
          disablePortal
          sx={{
            '& .MuiPaper-root': {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            },
          }}
        >
          <IconButton
            onClick={handleCloseChoice}
            sx={{ position: 'absolute', top: '16px', right: '16px' }}
          >
            <Icon name="close" color="#000" />
          </IconButton>
          <Typography variant="h3" marginBottom={4}>
            Выберите предложение
          </Typography>
          <Grid2 container spacing={1.1}>
            {product.options.map((el: { name: string; id: number }) => (
              <Grid2
                key={el.id}
                size={12}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                borderBottom={'1px solid rgb(235, 235, 235)'}
                paddingBottom={'11px'}
              >
                <Typography>{el.name}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleClick(String(id));
                  }}
                  disabled={isPromoFetching}
                  sx={{ width: '90px', height: '40px' }}
                >
                  Получить
                </Button>
              </Grid2>
            ))}
          </Grid2>
        </Dialog>
      )}
    </Grid2>
  );
};

export default BenefitsProductPage;
