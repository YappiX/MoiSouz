'use client';

import { FC, useState } from 'react';
import { IconButton } from '@mui/material';

import { Icon } from '@/components/ui';
import { FeedbackDialog } from './dialogs';

import { PropsWithClassName, PropsWithSX } from '@/models/Props';

interface Props {
  withEmail?: boolean;
}

export const ButtonFeedback: FC<PropsWithClassName & PropsWithSX & Props> = ({
  className,
  sx,
  withEmail,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton className={className} sx={sx} onClick={() => setOpen(true)}>
        <Icon name="help" />
      </IconButton>
      <FeedbackDialog
        open={open}
        onClose={() => setOpen(false)}
        withEmail={withEmail}
      />
    </>
  );
};
