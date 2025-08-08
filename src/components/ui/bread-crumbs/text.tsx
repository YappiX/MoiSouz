import { FC, Fragment } from 'react';

import { Box, Typography } from '@mui/material';
import { Icon } from '../Icon';
import Link from 'next/link';

interface PropsText {
  text: string;
  link?: string;
}
const Text: FC<PropsText> = ({ text, link }) => {
  const render = (
    <Typography
      sx={{ textDecoration: link && 'underline' }}
      fontSize={14}
      color="#202224"
      fontWeight={600}
    >
      {text}
    </Typography>
  );

  if (link) {
    return <Link href={link}>{render}</Link>;
  }
  return render;
};

interface Props {
  data: PropsText[];
}
export const BreadCrumbsText: FC<Props> = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {data.map((el, i) => (
        <Fragment key={`${i}-${el}`}>
          {i > 0 && (
            <Icon sx={{ scale: '-1 1' }} name="arrow-back" color="#202224" />
          )}
          <Text {...el} />
        </Fragment>
      ))}
    </Box>
  );
};
