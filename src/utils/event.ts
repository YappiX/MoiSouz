'use client';

export const eventBlock = (event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};
