'use client';

import React from 'react';
import { List } from '@mui/material';

import { ListItem } from '@/components/ui';

import styles from './aside.module.scss';
import { useGetProfileInfo } from '@/hooks/UseGetProfileInfo';

export const ProfileAside = () => {
  const { profileInfo: info } = useGetProfileInfo();
  return (
    <List className={styles.wrapper}>
      <List className={styles.content}>
        <ListItem label="Главная" icon="time" to="/main" />
        {/* {<ListItem label="Уведомления" icon="notify" disabled />
        <ListItem label="Задачи" icon="tasks" disabled />} */}
        <ListItem
          label="Документы"
          icon="document"
          to="/documents?incoming"
          openAlwaysOn={['/documents']}
        >
          <ListItem label="Входящие" to="/documents?incoming" />
          <ListItem label="Исходящие" to="/documents?outgoing" />
          <ListItem label="Черновики" to="/documents?drafts" />
          <ListItem
            label="Внутренние"
            to="/documents?inside"
            hidden={!info?.ROLES?.includes('ROLE_TRADEUNION')}
          />
        </ListItem>
        {/* <ListItem label="Мои организации" icon="square-2x2" disabled /> */}
        <ListItem label="Коллеги" icon="peoples" to="/colleagues" />

        {info?.hasTradeunionOwner == false && (
          <ListItem label="Новости" icon="info" to="/news" />
        )}

        {info?.hasTradeunionOwner == true && (
          <ListItem
            label="Новости"
            icon="info"
            to="/news"
            openAlwaysOn={['/news']}
            selectedAlways={false}
          >
            <ListItem label="Все новости" to="/news" equals />
            <ListItem label="Новости организации" to="/news/edit" />
          </ListItem>
        )}

        {/* <ListItem label="Деньги" icon="money" disabled />*/}
        <ListItem
          label="Скидки, льготы"
          icon="gift"
          to="/benefits"
          openAlwaysOn={['/promo', '/benefits']}
        >
          <ListItem label="Все" to="/benefits" equals />
          {!info?.hasTradeunionOwner ? (
            <ListItem label="Полученные" to="/promo" />
          ) : (
            <></>
          )}
          <ListItem label="Избранное" to="/benefits/favorites" />
        </ListItem>
        {/* <ListItem label="Магазин" icon="square-3x3" disabled />
        <ListItem label="Информация" icon="info" disabled />*/}
      </List>
    </List>
  );
};
