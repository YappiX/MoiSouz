'use client';

import React, { Suspense, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import Slider from 'react-slick';

import {
  InputAutocompleteAsync,
  InputSearch,
  PaginationSimple,
  SliderArrowNext,
  SliderArrowPrev,
} from '@/components/ui';
import {
  BenefitsCategory,
  BenefitsProduct,
  BenefitsStat,
} from '@/components/sections/Benefits';

import useScreen from '@/hooks/useScreen';
import { useQuery } from '@tanstack/react-query';
import {
  getBenefitsCategories,
  useFetchBenefitsProducts,
} from '@/services/benefits';
import { useSearchParamsCustom } from '@/services/universal/search-params';

import { IBenefitsCategory } from '@/models/Benefits';

const SLIDER_SETTINGS = {
  infinite: true,
  speed: 500,
  //slidesToShow: 6,
  slidesToScroll: 1,
  swipeToSlide: true,
  prevArrow: <SliderArrowPrev />,
  nextArrow: <SliderArrowNext />,
};

const BenefitsWrapper = () => {
  const screen = useScreen();

  const {
    data: searchParams,
    actions: { set: setSearchParam, remove: removeSearchParam },
  } = useSearchParamsCustom({ fields: ['category', 'q', 'city'] });

  const { data: categories } = useQuery({
    queryKey: ['benefits-categories'],
    queryFn: getBenefitsCategories,
    select: (data) => data.data.data,
  });

  const perPage = 15;
  const {
    data: { data: products, isFetching, empty, page, total },
    actions: { loadPrev, loadNext },
  } = useFetchBenefitsProducts({
    perPage,
    category: searchParams.category as number,
    q: searchParams.q as string,
    city: searchParams.city as string,
  });

  const category: IBenefitsCategory | null = useMemo(() => {
    if (categories)
      return (
        categories.find(
          (el: IBenefitsCategory) => el.id == searchParams.category,
        ) ?? null
      );
  }, [categories, searchParams.category]);

  const handleClickCategory = (data: IBenefitsCategory) => {
    // unselect !?
    if (searchParams.category == data.id) {
      removeSearchParam('category');
      return;
    }

    setSearchParam('category', data.id);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1.5} marginTop={3}>
        <Typography variant="h3" marginBottom={2}>
          Скидки и льготы
        </Typography>
        <Box display="none" flexWrap="wrap" gap={1.5}>
          <BenefitsStat
            name="Скидок получено"
            sx={{
              flex: screen == 'mobile' ? '100%' : '30%',
              maxWidth: screen == 'mobile' ? '100%' : 'calc(50% - 7px)',
            }}
            value={12}
            icon="benefits-coin"
            color="#FEC53D"
          />
          <BenefitsStat
            name="Льгот получено"
            sx={{
              flex: screen == 'mobile' ? '100%' : '30%',
              maxWidth: screen == 'mobile' ? '100%' : 'calc(50% - 7px)',
            }}
            value={2}
            icon="benefits-gift"
            color="#5CC382"
          />
          <BenefitsStat
            name="Текущая экономия"
            sx={{
              flex: screen == 'mobile' ? '100%' : '30%',
              maxWidth: screen == 'mobile' ? '100%' : 'calc(50% - 7px)',
            }}
            value="700₽"
            icon="benefits-chart"
            color="#4AD991"
          />
        </Box>

        <Box
          position="relative"
          display="flex"
          justifyContent={products.length > 2 ? 'space-between' : ''}
          flexWrap="wrap"
          width="100%"
          gap={1.5}
          marginTop={14}
        >
          <Box position="absolute" width="100%" paddingX={3} top={-140}>
            {categories && (
              <Slider
                {...SLIDER_SETTINGS}
                slidesToShow={
                  screen == 'mobile' ? 2 : screen == 'tablet' ? 3 : 5
                }
                initialSlide={categories.findIndex(
                  (el: IBenefitsCategory) =>
                    el.id == (searchParams.category || -1),
                )}
              >
                {categories.map((el: IBenefitsCategory) => (
                  <Box key={el.id} paddingX={0.5}>
                    <BenefitsCategory
                      sx={{
                        height: '125px',
                        width: '100%',
                      }}
                      data={el}
                      active={el.id == searchParams.category}
                      onClick={handleClickCategory}
                    />
                  </Box>
                ))}
              </Slider>
            )}
          </Box>

          <Box sx={{ display: 'flex', width: '100%', gap: 1.5 }}>
            <InputSearch
              sx={{ flex: 1.5 }}
              defaultValue={searchParams.q ? (searchParams.q as string) : ''}
              onSearch={(value) => setSearchParam('q', value)}
            />

            <InputAutocompleteAsync
              sx={{ flex: 1 }}
              api="cities"
              convert={(value) => ({ id: value.id, title: value.name })}
              placeholder="Выберите город"
              value={
                (searchParams.city &&
                  JSON.parse(searchParams.city as string)) ||
                null
              }
              onChange={(value) =>
                value
                  ? setSearchParam('city', JSON.stringify(value))
                  : removeSearchParam('city')
              }
            />
          </Box>

          {products.map((el) => (
            <Link
              key={el.id}
              href={`/benefits/product/${el.id}`}
              style={{
                display: 'flex',
                flex:
                  screen == 'mobile'
                    ? '100%'
                    : screen == 'tablet'
                      ? 'calc(50% - 8px)'
                      : 'calc(33% - 8px)',
                maxWidth:
                  screen == 'mobile'
                    ? '100%'
                    : screen == 'tablet'
                      ? 'calc(50% - 8px)'
                      : 'calc(33% - 8px)',
                width: '100%',
              }}
            >
              <BenefitsProduct data={el} active={el.id == category?.id} />
            </Link>
          ))}
        </Box>

        <PaginationSimple
          page={page}
          perPage={perPage}
          total={total}
          loading={isFetching}
          onPrev={loadPrev}
          onNext={loadNext}
        />

        {!isFetching && empty && (
          <Typography fontSize={16} fontWeight="bold" align="center">
            Нет данных
          </Typography>
        )}
      </Box>
    </>
  );
};

const BenefitsPage = () => {
  return (
    <Suspense>
      <BenefitsWrapper />
    </Suspense>
  );
};

export default BenefitsPage;
