'use client';

import NewProfileDialog from '@/components/entities/profile/newProfileDialog';
import Table from '@/components/sections/Docs/Table';
import { Icon } from '@/components/ui';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import { getDocs } from '@/services/getDocs';
import { Box, Button, Popover, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { globalTheme } from '@/styles/theme';
import { TradeunionCheckDocumentDialog } from '@/components/entities/profile';
import { useIsUserActive } from '@/hooks/useIsUserActive';
import { IDoc, INewDoc } from '@/models/Doc';
import { INewProtocol } from '@/models/Protocol';

const DocumentsWrapper = () => {
  const { data: docs } = useQuery({
    queryKey: ['docs'],
    queryFn: getDocs,
    select: (data) => data,
  });
  const params = useSearchParams();
  const param = !!params.entries().toArray().length
    ? params.entries().toArray()[0][0]
    : null;

  const [filtredDocs, setFiltredDocs] = useState<
    (IDoc | INewDoc | INewProtocol)[]
  >([]);

  const { info } = useFetchProfile();
  const isActive = useIsUserActive();
  const [open, setOpen] = useState(false);
  const [openMember, setOpenMember] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(
        info != null &&
          !!info?.ROLES?.includes('ROLE_TRADEUNION') &&
          !info?.hasTradeunionOwner,
      );
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [info]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenMember(
        info != null &&
          !info?.ROLES?.includes('ROLE_TRADEUNION') &&
          !info?.hasTradeunionMember,
      );
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [info?.ROLES, info?.hasTradeunionMember]);

  useEffect(() => {
    if (docs) {
      const arr =
        Array.isArray(docs) && param
          ? docs.filter((el) => el.folder === param)
          : Array.isArray(docs)
            ? docs
            : [];
      setFiltredDocs(arr);
    }
  }, [docs, param]);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Typography variant="h3" marginBottom={2}>
          Документы
        </Typography>

        <Button
          variant="contained"
          onClick={(e) => {
            if (isActive) handleMenuOpen(e);
            else if (info?.ROLES?.includes('ROLE_TRADEUNION')) setOpen(true);
            else setOpenMember(true);
          }}
          sx={{ marginBottom: '12px' }}
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
              <Typography variant="h3" textAlign={'center'} marginBottom={2}>
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
      </Box>
      <Table docs={filtredDocs} />
      <TradeunionCheckDocumentDialog
        open={openMember}
        setOpen={setOpenMember}
      />
      <NewProfileDialog
        open={open}
        btn="Заполнить"
        link="/profile"
        title="Для того, чтобы воспользоваться всеми функциями системы, заполните анкету организации, выберите и оплатите тариф"
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};

const DocumentsPage = () => {
  return (
    <Suspense>
      <DocumentsWrapper />
    </Suspense>
  );
};

export default DocumentsPage;
