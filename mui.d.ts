import { Palette, PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    red: Palette['red'];
    gray: Palette['gray'];
  }

  interface PaletteOptions {
    red?: PaletteOptions['red'];
    gray?: PaletteOptions['gray'];
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonOwnProps {
    variant?: 'standard' | 'contained' | 'contained-gray' | 'contained-red';
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    popover: true;
  }
}
