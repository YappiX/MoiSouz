import React, { FC } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import { globalTheme } from '@/styles/theme';
import { Icon } from '@/components/ui';

interface IDialogProps {
  open: boolean;
  title: string;
  link: string | string[];
  btn?: string | string[];
  onClose?: () => void;
  setOpen?: (tf: boolean) => void;
}

const NewProfileDialog: FC<IDialogProps> = ({
  btn,
  open,
  title,
  link,
  onClose,
  setOpen,
}) => {
  const closeFunc = !onClose && setOpen ? () => setOpen(false) : onClose;
  return (
    <Dialog open={open} onClose={closeFunc} fullWidth>
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
          onClick={closeFunc}
          sx={{ position: 'absolute', top: '-16px', right: '-16px' }}
        >
          <Icon name="close" color="#000" />
        </IconButton>

        <Typography variant="h3" marginBottom={2} textAlign={'center'}>
          {title}
        </Typography>
        {!Array.isArray(link) ? (
          <Link href={link} style={{ width: '100%' }}>
            <Button
              variant="contained"
              sx={{
                padding: '15px 100px',
                fontSize: '20px',
                lineHeight: '27px',
                width: '100%',
                '&.Mui-disabled': {
                  backgroundColor: `${globalTheme.palette.primary.main} !important`,
                  color: 'white !important',
                },
              }}
            >
              {btn}
            </Button>
          </Link>
        ) : (
          link.map((el, id) => (
            <Link href={el} key={el} style={{ width: '100%' }}>
              <Button
                variant="contained"
                sx={{
                  padding: '15px 100px',
                  fontSize: '20px',
                  lineHeight: '27px',
                  width: '100%',
                  marginBottom: '12px',
                  '&.Mui-disabled': {
                    backgroundColor: `${globalTheme.palette.primary.main} !important`,
                    color: 'white !important',
                  },
                }}
              >
                {btn && btn[id]}
              </Button>
            </Link>
          ))
        )}
      </Box>
    </Dialog>
  );
};

export default NewProfileDialog;
