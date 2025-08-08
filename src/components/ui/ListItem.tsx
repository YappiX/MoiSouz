/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { FC, ReactElement, Suspense, useMemo, useState } from 'react';
import {
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Icon, IconName } from '@/components/ui';

interface Props {
  label: string;
  icon?: IconName;
  to?: string;
  equals?: boolean;
  indent?: number;
  openDefault?: boolean;
  openAlways?: boolean;
  /** Array of starts urls */
  openAlwaysOn?: string[];
  selectedAlways?: boolean;
  children?: ReactElement | ReactElement[];
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

interface PropsChildren {
  indent?: number;
  children?: ReactElement | ReactElement[];
}
const Children = ({ indent = 0, children }: PropsChildren) => {
  return useMemo(() => {
    if (children == null) return null;
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          indent: indent + 1,
        });
      }
      return child;
    });
  }, [children]);
};

interface PropsItem extends Props {
  selected?: boolean;
}
const Item: FC<PropsItem> = ({
  label,
  icon,
  selected,
  indent = 0,
  openDefault = false,
  openAlways,
  children,
  onClick,
  disabled,
}) => {
  const [open, setOpen] = useState(openDefault);
  const isParentLabelSelected =
    label !== 'Документы' && label !== 'Скидки, льготы';

  const handleClick = () => {
    setOpen(!open);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onClick && onClick();
  };

  return (
    <>
      <ListItemButton
        sx={{
          pl: indent ? 4.6 * indent : undefined,
          borderRadius: '6px',
        }}
        selected={selected && isParentLabelSelected}
        onClick={handleClick}
        disabled={disabled}
      >
        {icon && (
          <ListItemIcon sx={{ minWidth: 30 }}>
            <Icon name={icon} />
          </ListItemIcon>
        )}
        <ListItemText primary={label} />
        {/* Icon expand */}
        {/*children && (open ? <ExpandLess /> : <ExpandMore />)*/}
      </ListItemButton>
      {children && (
        <Collapse
          in={openAlways == null ? open : openAlways}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            {<Children indent={indent}>{children}</Children>}
          </List>
        </Collapse>
      )}
    </>
  );
};

const ListItemSP: FC<Props> = ({
  to,
  equals,
  openAlways,
  openAlwaysOn,
  selectedAlways,
  hidden,
  ...props
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = useMemo(() => {
    if (selectedAlways != null) return selectedAlways;
    if (to == null) return false;
    if (equals) {
      if (pathname != to.split('?')[0]) return false;
    } else {
      if (pathname.startsWith(to.split('?')[0]) == false) return false;
    }

    const url = `${pathname}?${searchParams}`;
    return url.startsWith(to);
  }, [to, equals, selectedAlways, pathname, searchParams]);

  const isOpenAlways = useMemo(() => {
    if (openAlways != null) return openAlways;
    if (openAlwaysOn == null) return undefined;
    if (openAlwaysOn.length == 0) return undefined;
    return openAlwaysOn.some((el) => pathname.startsWith(el));
  }, [openAlways, openAlwaysOn, pathname]);

  if (to) {
    return (
      <Link href={to} style={{ width: '100%', display: hidden ? 'none' : '' }}>
        <Item {...props} selected={selected} openAlways={isOpenAlways} />
      </Link>
    );
  }

  return <Item {...props} selected={selected} openAlways={isOpenAlways} />;
};

export const ListItem: FC<Props> = ({ ...props }) => {
  return (
    <Suspense>
      <ListItemSP {...props} />
    </Suspense>
  );
};
