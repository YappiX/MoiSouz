import { FC } from 'react';
import { IconButton, SliderProps } from '@mui/material';
import { Icon } from '@/components/ui/Icon';

export const SliderArrowPrev: FC<SliderProps> = (props) => {
  const { style, onClick } = props;
  return (
    <div
      style={{
        position: 'absolute',
        left: -40,
        top: '52%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        cursor: 'pointer',
        ...style,
      }}
      onClick={onClick}
    >
      <IconButton sx={{ width: 50, height: 50 }}>
        <Icon name="arrow-back" sx={{ scale: 1.5 }} />
      </IconButton>
    </div>
  );
};

export const SliderArrowNext: FC<SliderProps> = (props) => {
  const { style, onClick } = props;
  return (
    <div
      style={{
        ...style,
        position: 'absolute',
        right: -43,
        top: '52%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <IconButton sx={{ width: 50, height: 50 }}>
        <Icon sx={{ rotate: '180deg', scale: 1.5 }} name="arrow-back" />
      </IconButton>
    </div>
  );
};
