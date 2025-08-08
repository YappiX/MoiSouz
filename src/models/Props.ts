import { CSSProperties } from 'react';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/system';

export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithStyle {
  style?: CSSProperties;
}

export interface PropsWithSX {
  sx?: SxProps<Theme>;
}
