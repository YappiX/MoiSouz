import {
  Box,
  ButtonBase,
  Divider,
  Grid2,
  Paper,
  Typography,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@mui/material';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { IFormColleagueProfile } from '@/models/Colleague';
import { ITradeUnion } from '@/models/TradeUnion';
import { Icon } from '@/components/ui';
import { PropsWithSX } from '@/models/Props';

interface IRowProps {
  user: IFormColleagueProfile;
  clickable?: boolean;
  disabled?: boolean;

  onClick?: (user: IFormColleagueProfile) => void;
}

const Row: FC<PropsWithChildren & PropsWithSX & IRowProps> = ({
  children,
  sx,
  user,
  clickable,
  disabled,
  onClick,
}) => {
  if (clickable) {
    return (
      <ButtonBase
        sx={{ width: '100%', ...(sx || {}) }}
        onClick={() => onClick && onClick(user)}
        disabled={disabled}
      >
        {children}
      </ButtonBase>
    );
  }
  return children;
};

interface ITableProps {
  users: IFormColleagueProfile[] | undefined;
  tradeunion?: ITradeUnion | null;
  owner?: boolean;
  onClick?: (user: IFormColleagueProfile) => void;
  onShow?: (user: IFormColleagueProfile) => void;
  onEdit?: (user: IFormColleagueProfile) => void;
  onDelete?: (user: IFormColleagueProfile) => void;
}

export const Table: FC<ITableProps> = ({
  users,
  tradeunion,
  owner,
  onClick,
  onShow,
  onEdit,
  onDelete,
}) => {
  const [groupedData, setGroupedData] = useState(users);

  const [openMenu, setOpenMenu] = useState<{
    index: number;
    anchorE1: HTMLElement;
  } | null>(null);

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

  const handleRowClick = (user: IFormColleagueProfile) => {
    handleMenuClose();
    if (openMenu) return;
    if (onClick) onClick(user);
  };

  const handleMenuShow = (user: IFormColleagueProfile) => {
    handleMenuClose();
    if (onShow) onShow(user);
  };

  const handleMenuEdit = (user: IFormColleagueProfile) => {
    handleMenuClose();
    if (onEdit) onEdit(user);
  };

  const handleMenuDelete = (user: IFormColleagueProfile) => {
    handleMenuClose();
    if (onDelete) onDelete(user);
  };

  const handleSort = (param: string) => {
    setGroupedData((prev) => {
      if (!prev) return prev;
      return [
        ...prev
          .sort((a, b) => {
            // @ts-expect-error none
            if (typeof a[param] === 'string') {
              // @ts-expect-error none
              return b[param].localeCompare(a[param]) > 0 ? 1 : 0;
            }
            // @ts-expect-error none
            else return Number(a[param] > b[param]);
          })
          .reverse(),
      ];
    });
  };

  useEffect(() => {
    if (users) setGroupedData(users);
  }, [users]);

  return (
    <Paper sx={{ p: 0, pb: 1.6 }}>
      <Grid2 container sx={{ p: 1.6 }}>
        <Grid2 size={2}>
          <Typography
            variant="body2"
            fontWeight={700}
            textTransform={'uppercase'}
          >
            ФИО
            <IconButton
              onClick={() => {
                handleSort('name');
              }}
              sx={{ padding: 0.4, transform: 'translateY(-1px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        <Grid2 size={!!owner ? 2.5 : 3.5}>
          <Typography
            variant="body2"
            fontWeight={700}
            textTransform={'uppercase'}
          >
            Организация
          </Typography>
        </Grid2>
        <Grid2 size={!!owner ? 2.5 : 3.5}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
          >
            Должность
          </Typography>
        </Grid2>
        <Grid2 size={!!owner ? 2 : 3}>
          <Typography
            variant="body2"
            textTransform={'uppercase'}
            fontWeight={700}
          >
            Роль
            <IconButton
              onClick={() => {
                handleSort('role');
              }}
              sx={{ padding: 0.4, transform: 'translateY(-1px)' }}
            >
              <Icon name="sort" />
            </IconButton>
          </Typography>
        </Grid2>
        {!!owner && (
          <Grid2 size={2.5}>
            <Typography
              variant="body2"
              textTransform={'uppercase'}
              fontWeight={700}
            >
              Способ связи
            </Typography>
          </Grid2>
        )}
      </Grid2>
      <Divider></Divider>
      {groupedData && !!groupedData.length ? (
        groupedData.map((el, index, arr) => (
          <Box key={el.id}>
            <Row
              sx={{
                backgroundColor: `${
                  openMenu?.index == index ? 'rgba(0,0,0,0.1)' : ''
                } !important`,
              }}
              user={el}
              clickable={true}
              onClick={handleRowClick}
            >
              <Grid2
                container
                sx={{
                  p: 1.6,
                  width: '100%',
                  textAlign: 'left',
                  userSelect: owner ? 'none' : 'all',
                }}
              >
                <Grid2 size={2}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    py={1}
                    sx={{ userSelect: 'none' }}
                  >
                    {el.name}
                  </Typography>
                </Grid2>
                <Grid2 size={!!owner ? 2.5 : 3.5}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    py={1}
                    sx={{ userSelect: 'none' }}
                  >
                    {tradeunion?.title}
                  </Typography>
                </Grid2>
                <Grid2 size={!!owner ? 2.5 : 3.5}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    py={1}
                    sx={{ userSelect: 'none' }}
                  >
                    {el.position && el.position[0]}
                  </Typography>
                </Grid2>
                <Grid2 size={!!owner ? 2 : 3}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    py={1}
                    sx={{ userSelect: 'none' }}
                  >
                    {el.role}
                  </Typography>
                </Grid2>
                {!!owner && (
                  <Grid2 size={2.5}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      py={1}
                      sx={{ userSelect: 'none' }}
                    >
                      {[el.email, el.phone].filter((el) => el).join(', ')}
                    </Typography>
                  </Grid2>
                )}
                {!!owner && (
                  <Grid2 size={0.5}>
                    <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                      <Icon name="menu" color="darkgray" />
                    </IconButton>
                    <Popover
                      id="user-menu"
                      anchorEl={openMenu?.anchorE1}
                      open={openMenu?.index == index}
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
                      <MenuItem onClick={() => handleMenuShow(el)}>
                        <ListItemIcon>
                          <Icon name="eye-on" />
                        </ListItemIcon>
                        <ListItemText>Посмотреть</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleMenuEdit(el)}>
                        <ListItemIcon>
                          <Icon name="edit" />
                        </ListItemIcon>
                        <ListItemText>Редактировать</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleMenuDelete(el)}
                        sx={{ display: 'none' }}
                      >
                        <ListItemIcon>
                          <Icon name="delete" color="red" />
                        </ListItemIcon>
                        <ListItemText>Удалить</ListItemText>
                      </MenuItem>
                    </Popover>
                  </Grid2>
                )}
              </Grid2>
            </Row>
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
