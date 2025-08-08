/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FC, PropsWithChildren, RefObject, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Grid2,
  Popover,
  SxProps,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ruRU } from '@mui/x-date-pickers/locales';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import 'dayjs/locale/ru';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithClassName, PropsWithSX } from '@/models/Props';
import { globalTheme } from '@/styles/theme';
import { Icon, IconName } from '@/components/ui';
import { useFetchProfile } from '@/hooks/useFetchProfile';

interface Props {
  reference?: RefObject<HTMLFormElement | null>;
  title?: string;
  loading?: boolean;

  buttonsCancel?: {
    text: string;
    variant?: ButtonProps['variant'];
    icon?: IconName;
    sx?: SxProps;
    onClick?: () => void;
  }[];
  buttonsSubmit?: {
    text: string;
    variant?: ButtonProps['variant'];
    icon?: IconName;
    sx?: SxProps;
    onClick?: () => void;
  }[];
  onCancel?: () => void;
  onSubmit: (data: any | undefined) => void;

  /** for FormProvider */
  methods: UseFormReturn<any, any, undefined>;
  defaultValues?: any;
  errorsExtra?: { [key: string]: string } | null;

  /**  */
  checkTradeUnionMember?: boolean;
}

export const Form: FC<
  PropsWithChildren & PropsWithClassName & PropsWithSX & Props
> = ({
  reference,
  children,
  className,
  sx,
  title,
  loading,

  buttonsCancel = [{ text: 'Отмена' }],
  buttonsSubmit = [{ text: 'Сохранить' }],
  onCancel,
  onSubmit,

  methods,
  errorsExtra,
  checkTradeUnionMember = true,
}) => {
  const path = usePathname();
  const [openMenu, setOpenMenu] = useState<{
    anchorE1: HTMLElement;
  } | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenu({
      anchorE1: event.currentTarget,
    });
  };
  const handleMenuClose = () => {
    setOpenMenu(null);
  };
  const { info } = useFetchProfile();

  useEffect(() => {
    if (errorsExtra == null) return;
    Object.keys(errorsExtra).forEach(
      (key) =>
        methods?.setError(key, { type: 'custom', message: errorsExtra[key] }),
    );
  }, [errorsExtra]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={
        ruRU.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box
        className={className}
        sx={{
          width: '100%',
          ...(sx || {}),
        }}
      >
        <FormProvider {...methods}>
          <form ref={reference} onSubmit={onSubmit}>
            <Grid2 container>
              {title && (
                <Grid2 size={8}>
                  <Typography variant="h3" lineHeight={'38.5px'}>
                    {title}
                  </Typography>
                </Grid2>
              )}
              {checkTradeUnionMember &&
                !path.includes('trade_union_member') &&
                !path.includes('membership') && (
                  <Grid2
                    size={4}
                    container
                    justifyContent={'flex-end'}
                    flexDirection={'column'}
                    alignItems={'flex-end'}
                    gap={'20px'}
                  >
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleMenuOpen(e);
                      }}
                    >
                      <Icon
                        name={'newDoc'}
                        color="#ffffff"
                        sx={{ marginRight: '6px' }}
                      ></Icon>
                      Создать документ
                    </Button>
                    <Popover
                      id="create-doc"
                      anchorEl={openMenu?.anchorE1}
                      open={!!openMenu?.anchorE1}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      slotProps={{
                        paper: {
                          variant: 'popover',
                        },
                      }}
                      disableScrollLock
                    >
                      <Box
                        sx={{
                          p: 2.4,
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          m: '0 auto',
                        }}
                      >
                        <Box
                          display={'flex'}
                          flexDirection={'row'}
                          justifyContent={'center'}
                        >
                          <Typography
                            variant="h3"
                            textAlign={'center'}
                            marginBottom={2}
                          >
                            Выберите тип документа
                          </Typography>
                        </Box>
                        {info?.ROLES?.includes('ROLE_TRADEUNION') ? (
                          <>
                            <Link
                              href={'/new_document'}
                              style={{ width: '50%', margin: '0 auto ' }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  padding: '15px',
                                  fontSize: '16px',
                                  lineHeight: '20px',
                                  margin: '0 auto 12px',
                                  width: '100%',
                                  '&.Mui-disabled': {
                                    backgroundColor: `${globalTheme.palette.primary.main} !important`,
                                    color: 'white !important',
                                  },
                                }}
                              >
                                Повестка
                              </Button>
                            </Link>
                            <Link
                              href={'/new_protocol'}
                              style={{ width: '50%', margin: '0 auto ' }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  padding: '15px',
                                  fontSize: '16px',
                                  lineHeight: '20px',

                                  width: '100%',
                                  '&.Mui-disabled': {
                                    backgroundColor: `${globalTheme.palette.primary.main} !important`,
                                    color: 'white !important',
                                  },
                                }}
                              >
                                Протокол
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href={'/trade_union_member'}
                              style={{ width: '100%', margin: '0 auto' }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  padding: '15px ',
                                  fontSize: '16px',
                                  lineHeight: '20px',
                                  margin: '0 auto 12px',
                                  width: '100%',
                                  '&.Mui-disabled': {
                                    backgroundColor: `${globalTheme.palette.primary.main} !important`,
                                    color: 'white !important',
                                  },
                                }}
                              >
                                Заявление на вступление в профсоюз
                              </Button>
                            </Link>
                            {/* {<Button
              variant="contained"
              disabled
             sx={{
                      padding: '15px',
                      fontSize: '16px',
                      lineHeight: '20px',

                      width: '100%',
                      '&.Mui-disabled': {
                        backgroundColor: `${globalTheme.palette.primary.main} !important`,
                        color: 'white !important',
                      },
                    }}
            >
              Обращение в профсоюз
            </Button>} */}
                          </>
                        )}
                      </Box>
                    </Popover>
                  </Grid2>
                )}
            </Grid2>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: title ? 3 : 0,
                p: 2,
                backgroundColor: 'white',
                borderRadius: 6,
              }}
            >
              <fieldset
                style={{
                  border: 'none',
                }}
                disabled={loading}
              >
                {children}
              </fieldset>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                  gap: 2,
                }}
              >
                {!loading &&
                  buttonsCancel?.map((el, index) => (
                    <Button
                      key={`${index}-cancel-${el.text}`}
                      type="button"
                      variant={el.variant || 'outlined'}
                      sx={{
                        padding: '15px 30px',
                        fontSize: '20px',
                        lineHeight: '27px',
                        ...(el.sx || {}),
                      }}
                      disabled={loading}
                      onClick={() => {
                        if (el.onClick) el.onClick();
                        if (onCancel) onCancel();
                      }}
                    >
                      {el.text}
                    </Button>
                  ))}

                {!loading &&
                  buttonsSubmit?.map((el, index) => (
                    <Button
                      key={`${index}-submit-${el.text}`}
                      type="submit"
                      variant={el.variant || 'contained'}
                      sx={{
                        padding: '15px 30px',
                        fontSize: '20px',
                        lineHeight: '27px',
                        '&.Mui-disabled': {
                          backgroundColor: `${globalTheme.palette.primary.main} !important`,
                          color: 'white !important',
                        },
                        gap: 1,
                        ...(el.sx || {}),
                      }}
                      onClick={(e) => {
                        if (el.onClick) el.onClick();
                        if (onSubmit) onSubmit(e);
                      }}
                    >
                      {el.icon && (
                        <Icon name={el.icon} color="secondary.main" />
                      )}
                      {el.text}
                    </Button>
                  ))}

                {loading && (
                  <CircularProgress
                    sx={{ my: '10px' }}
                    color="primary"
                    size="40px"
                  />
                )}
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </LocalizationProvider>
  );
};
