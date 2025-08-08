import { FC } from 'react';

import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { Icon } from '../Icon';

interface Props {
  page: number;
  perPage: number;
  total: number;
  loading?: boolean;

  onPrev: () => void;
  onNext: () => void;
}

export const PaginationSimple: FC<Props> = ({
  page = 1,
  perPage = 0,
  total = 0,
  loading,
  onPrev,
  onNext,
}) => {
  const hasPrev = page > 1;
  const hasNext = page * perPage < total;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {total > 0 && (
        <Typography color="gray">
          {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} из{' '}
          {total}
        </Typography>
      )}

      {total > 0 && loading != true && (
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2.5,
            border: '0.6px solid #D8D8D8',
            height: 30,
            px: 0.5,
            gap: 0.5,
            display: 'flex',
          }}
        >
          <IconButton
            size="large"
            disabled={!hasPrev}
            onClick={hasPrev ? onPrev : undefined}
          >
            <Icon name="arrow-back" color={hasPrev ? 'primary' : 'gray'} />
          </IconButton>
          <IconButton
            size="large"
            sx={{ scale: '-1 1' }}
            disabled={!hasNext}
            onClick={hasNext ? onNext : undefined}
          >
            <Icon name="arrow-back" color={hasNext ? 'primary' : 'gray'} />
          </IconButton>
        </Box>
      )}

      {loading == true && (
        <CircularProgress
          sx={{
            marginRight: 2.5,
            mx: total > 0 ? undefined : 'auto',
          }}
          size={30}
        />
      )}
    </Box>
  );
};
