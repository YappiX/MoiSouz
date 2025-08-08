import { type IDoc, type INewDoc } from '@/models/Doc';
import { groupByTU } from '@/utils/groupByTradeUnion';
import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid2,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { FC, useEffect, useMemo, useState } from 'react';
import s from './table.module.scss';
import { statusColor } from '@/utils/statusColor';
import { INewProtocol, type INewProt } from '@/models/Protocol';
import { Icon } from '@/components/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteDoc } from '@/services/getDocs';
import { useQueryClient } from '@tanstack/react-query';
import theme from '@/styles/theme';

interface ITableProps {
  docs: (IDoc | INewDoc | INewProtocol)[];
}

const Table: FC<ITableProps> = ({ docs }) => {
  const searchParams = useSearchParams();
  const [groupedDocs, setGroupedDocs] = useState(docs ? groupByTU(docs) : []);
  const [open, setOpen] = useState<string>('');
  const [sort, setSort] = useState({
    documentType: false,
    user: false,
    tu: false,
    documentNumber: false,
    documentDate: false,
    step: false,
  });
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<{
    index: number;
    anchorE1: HTMLElement;
  } | null>(null);

  const canEdit = useMemo(() => {
    if (searchParams.has('incoming')) return false;
    return true;
  }, [searchParams]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenu({
      index,
      anchorE1: event.currentTarget,
    });
  };
  const handleMenuClose = () => {
    setOpenMenu(null);
  };

  const handleMenuShow = (doc: IDoc | INewDoc | INewProt) => {
    handleMenuClose();
    router.push(
      'folder' in doc && doc.folder === 'drafts'
        ? `/documents/drafts/${doc.guid}`
        : `/documents/${doc.guid}`,
    );
  };

  const handleMenuEdit = (doc: IDoc | INewDoc | INewProt) => {
    handleMenuClose();
    router.push(`/documents/drafts/${doc.guid}`);
  };
  const queryClient = useQueryClient();

  const handleMenuDeleteOpen = (doc: IDoc | INewDoc | INewProt) => {
    if (doc.guid) setOpen(doc.guid);
  };
  const handleMenuDeleteClose = () => {
    setOpen('');
  };

  const handleMenuDelete = async (doc: IDoc | INewDoc | INewProt) => {
    handleMenuClose();
    await deleteDoc(doc.guid);
    await queryClient.refetchQueries({ queryKey: ['docs'] });
  };

  const handleSort = (param: string, reverse: boolean) => {
    setGroupedDocs((prev) => {
      if (!prev) return prev;
      if (param === 'user')
        return prev.map((group) => ({
          ...group,

          docs: reverse
            ? [...group.docs]
                // @ts-expect-error none
                .sort((a, b) => a.user?.name.localeCompare(b.user?.name))
                .reverse()
            : [...group.docs].sort(
                // @ts-expect-error none
                (a, b) => a.user?.name.localeCompare(b.user?.name),
              ),
        }));
      return prev.map((group) => ({
        ...group,

        docs: reverse
          ? [...group.docs]
              // @ts-expect-error none
              .sort((a, b) => a[param].localeCompare(b[param]))
              .reverse()
          : // @ts-expect-error none
            [...group.docs].sort((a, b) => a[param].localeCompare(b[param])),
      }));
    });
  };

  useEffect(() => {
    setGroupedDocs(groupByTU(docs));
  }, [docs]);

  return (
    <Paper sx={{ p: 0, pb: 1.6 }}>
      <Grid2 container sx={{ p: 1.6 }}>
        <Grid2 size={2}>
          <Typography
            variant="body2"
            fontWeight={700}
            textTransform={'uppercase'}
          >
            Организация
          </Typography>
        </Grid2>
        <Grid2 size={2}>
          <Typography
            variant="body2"
            fontWeight={700}
            textTransform={'uppercase'}
          >
            Документ
            <IconButton
              onClick={() => {
                handleSort('documentType', sort.documentType);
                setSort((prev) => {
                  return { ...prev, documentType: !prev.documentType };
                });
              }}
              sx={{ padding: 0.4, transform: 'translateY(-2px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        <Grid2 size={2}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
            textAlign={'center'}
          >
            Отправитель
            <IconButton
              onClick={() => {
                handleSort('user', sort.user);
                setSort((prev) => {
                  return { ...prev, user: !prev.user };
                });
              }}
              sx={{ padding: 0.4, transform: 'translateY(-2px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        <Grid2 size={1.5}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
            textAlign={'center'}
          >
            Номер
            <IconButton
              onClick={() => {
                handleSort('documentNumber', sort.documentNumber);
                setSort((prev) => {
                  return { ...prev, documentNumber: !prev.documentNumber };
                });
              }}
              sx={{ padding: 0.4, transform: 'translateY(-2px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        <Grid2 size={1.5}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
            textAlign={'center'}
          >
            Дата
            <IconButton
              onClick={() => {
                handleSort('documentDate', sort.documentDate);
                setSort((prev) => {
                  return { ...prev, documentDate: !prev.documentDate };
                });
              }}
              sx={{ padding: 0.4, transform: 'translateY(-2px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        <Grid2 size={1.5}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
            textAlign={'center'}
          >
            Статус
            <IconButton
              onClick={() => {
                handleSort('step', sort.step);
                setSort((prev) => {
                  return { ...prev, step: !prev.step };
                });
              }}
              sx={{ padding: 0.4, transform: 'translateY(-2px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        <Grid2 size={1}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
            textAlign={'center'}
          >
            Связь
          </Typography>
        </Grid2>
      </Grid2>
      <Divider></Divider>
      {groupedDocs && !!groupedDocs.length ? (
        groupedDocs.map((el, index, arr) => (
          <Box key={el.tradeunion + index}>
            <Grid2 container sx={{ p: 1.6 }}>
              <Grid2 size={2}>
                <Typography variant="body2" fontWeight={700} pt={2.4}>
                  {el.tradeunion}
                </Typography>
              </Grid2>
              <Grid2 size={10} position={'relative'}>
                {el &&
                  el.docs &&
                  el.docs.map((doc, id, array) => (
                    <Box
                      key={doc.guid}
                      className={doc.status === 'NEW' ? s.hoverBold : s.hover}
                    >
                      <Grid2 container sx={{ py: 2.4, position: 'relative' }}>
                        <Link
                          href={
                            'folder' in doc && doc.folder === 'drafts'
                              ? `/documents/drafts/${doc.guid}`
                              : `/documents/${doc.guid}`
                          }
                          style={{ width: '100%', display: 'flex' }}
                        >
                          <Grid2 size={2.4}>
                            <Typography
                              variant="body2"
                              fontWeight={doc.status === 'NEW' ? 700 : 600}
                            >
                              {doc.documentType === 'AM'
                                ? 'Заявление на вступление'
                                : doc.documentType === 'AG'
                                  ? 'Повестка заседания профкома'
                                  : doc.documentType === 'PR'
                                    ? 'Протокол заседания профкома'
                                    : doc.documentType}
                            </Typography>
                          </Grid2>
                          <Grid2 size={2.4}>
                            <Typography
                              variant="body2"
                              fontWeight={doc.status === 'NEW' ? 700 : 600}
                              textAlign={'center'}
                            >
                              {doc.documentType === 'AM' && doc.user
                                ? doc.user.name
                                : el.tradeunion}
                            </Typography>
                          </Grid2>
                          <Grid2 size={1.8}>
                            <Typography
                              variant="body2"
                              fontWeight={doc.status === 'NEW' ? 700 : 600}
                              textAlign={'center'}
                            >
                              {doc.documentNumber}
                            </Typography>
                          </Grid2>
                          <Grid2 size={1.8}>
                            <Typography
                              variant="body2"
                              fontWeight={doc.status === 'NEW' ? 700 : 600}
                              textAlign={'center'}
                            >
                              {doc.documentDate}
                            </Typography>
                          </Grid2>
                          <Grid2 size={1.8}>
                            <Typography
                              variant="body2"
                              fontWeight={doc.status === 'NEW' ? 700 : 600}
                              textAlign={'center'}
                            >
                              <span
                                className={s.statusBadge}
                                style={{
                                  backgroundColor: statusColor(doc.step),
                                }}
                              ></span>
                              {doc.step}
                            </Typography>
                          </Grid2>
                          <Grid2
                            size={1.2}
                            display={'flex'}
                            justifyContent={'center'}
                          >
                            {doc.data &&
                              'guid' in doc.data &&
                              doc?.data?.guid && (
                                <Link href={`/documents/${doc?.data?.guid}`}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={
                                      doc.status === 'NEW' ? 700 : 600
                                    }
                                    sx={{ textDecoration: 'underline' }}
                                  >
                                    Повестка
                                  </Typography>
                                </Link>
                              )}
                            {doc.documentType === 'AG' &&
                              array.find((element) => {
                                if (element.data && 'guid' in element.data)
                                  return element.data.guid === doc.guid;
                              })?.guid && (
                                <Link
                                  href={`/documents/${array.find((element) => {
                                    if (element.data && 'guid' in element.data)
                                      return element.data.guid === doc.guid;
                                  })?.guid}`}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight={
                                      doc.status === 'NEW' ? 700 : 600
                                    }
                                    sx={{ textDecoration: 'underline' }}
                                  >
                                    Протокол
                                  </Typography>
                                </Link>
                              )}
                          </Grid2>
                          <Grid2 size={0.6}></Grid2>
                        </Link>
                        <Box
                          position={'absolute'}
                          top={'50%'}
                          right={0}
                          sx={{ transform: 'translateY(-50%)' }}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleMenuOpen(e, id);
                            }}
                          >
                            <Icon name="menu" color="darkgray" />
                          </IconButton>
                          <Popover
                            id="user-menu"
                            anchorEl={openMenu?.anchorE1}
                            open={openMenu?.index == id}
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
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuShow(doc);
                              }}
                            >
                              <ListItemIcon>
                                <Icon name="eye-on" />
                              </ListItemIcon>
                              <ListItemText>Посмотреть</ListItemText>
                            </MenuItem>
                            {canEdit && (
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuEdit(doc);
                                }}
                              >
                                <ListItemIcon>
                                  <Icon name="edit" />
                                </ListItemIcon>
                                <ListItemText>Редактировать</ListItemText>
                              </MenuItem>
                            )}
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuDeleteOpen(doc);
                              }}
                            >
                              <ListItemIcon>
                                <Icon name="delete" color="red" />
                              </ListItemIcon>
                              <ListItemText>Удалить</ListItemText>
                            </MenuItem>
                          </Popover>
                        </Box>
                      </Grid2>

                      {id !== array.length - 1 && <Divider></Divider>}
                      <Dialog
                        open={doc.guid === open}
                        onClose={handleMenuDeleteClose}
                      >
                        {' '}
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
                          <IconButton
                            onClick={handleMenuDeleteClose}
                            sx={{
                              position: 'absolute',
                              top: '-16px',
                              right: '-16px',
                            }}
                          >
                            <Icon name="close" color="#000" />
                          </IconButton>

                          <Typography
                            variant="h3"
                            marginBottom={2}
                            textAlign={'center'}
                          >
                            Вы точно хотите удалить документ?
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleMenuDeleteClose();
                              handleMenuDelete(doc);
                            }}
                            sx={{
                              padding: '15px 100px',
                              fontSize: '20px',
                              lineHeight: '27px',
                              width: '100px',
                              marginBottom: '12px',
                              '&.Mui-disabled': {
                                backgroundColor: `${theme.palette.primary.main} !important`,
                                color: 'white !important',
                              },
                            }}
                          >
                            Да
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleMenuDeleteClose}
                            sx={{
                              padding: '15px 100px',
                              fontSize: '20px',
                              lineHeight: '27px',
                              width: '100px',
                              marginBottom: '12px',
                              '&.Mui-disabled': {
                                backgroundColor: `${theme.palette.primary.main} !important`,
                                color: 'white !important',
                              },
                            }}
                          >
                            Нет
                          </Button>
                        </Box>
                      </Dialog>
                    </Box>
                  ))}
              </Grid2>
            </Grid2>
            {index !== arr.length - 1 && <Divider></Divider>}
          </Box>
        ))
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1.2,
          }}
        >
          <Typography variant="h3">Здесь пока пусто</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Table;
