import React, { FC } from 'react';
import { List, ListItem, Paper, Typography } from '@mui/material';
import style from './progressBar.module.scss';
import { statusColor } from '@/utils/statusColor';

interface IProps {
  steps: number;
  initialSteps?: string[];
  decision?: boolean;
}

const ProgressBar: FC<IProps> = ({ steps, initialSteps, decision }) => {
  return (
    <Paper sx={{ p: 2.4 }}>
      <Typography variant="h3" marginBottom={1.2}>
        Статус документа
      </Typography>
      {!initialSteps ? (
        <List className={style.list}>
          <ListItem
            className={steps >= 1 ? style.listItemActive : style.listItem}
            sx={{
              '&:before': {
                backgroundColor: statusColor('Ожидает отправки'),
                border: `1px solid ${statusColor('Ожидает отправки')}`,
              },
            }}
          >
            <Typography variant="body2">Ожидает отправки</Typography>
          </ListItem>
          <ListItem
            className={steps >= 2 ? style.listItemActive : style.listItem}
            sx={{
              '&:before': {
                backgroundColor: statusColor('Отправлено в профсоюз'),
                border: `1px solid ${statusColor('Отправлено в профсоюз')}`,
              },
            }}
          >
            <Typography variant="body2">Отправлено в Профсоюз</Typography>
          </ListItem>
          <ListItem
            className={steps >= 3 ? style.listItemActive : style.listItem}
            sx={{
              '&:before': {
                backgroundColor: statusColor('На проверке профсоюзом'),
                border: `1px solid ${statusColor('На проверке профсоюзом')}`,
              },
            }}
          >
            <Typography variant="body2">На проверке Профсоюзом</Typography>
          </ListItem>
          {!decision ? (
            <>
              <ListItem
                className={steps >= 4 ? style.listItemActive : style.listItem}
                sx={{
                  '&:before': {
                    backgroundColor: statusColor(
                      'Решение положительное, ожидает передачи оригинала в Профсоюз',
                    ),
                    border: `1px solid ${statusColor(
                      'Решение положительное, ожидает передачи оригинала в Профсоюз',
                    )}`,
                  },
                }}
              >
                <Typography variant="body2">
                  Решение положительное, ожидает передачи оригинала в Профсоюз
                </Typography>
              </ListItem>
              <ListItem
                className={steps >= 5 ? style.listItemActive : style.listItem}
                sx={{
                  '&:before': {
                    backgroundColor: statusColor('Оригинал получен'),
                    border: `1px solid ${statusColor('Оригинал получен')}`,
                  },
                }}
              >
                <Typography variant="body2">Оригинал получен</Typography>
              </ListItem>
            </>
          ) : (
            <ListItem
              className={steps >= 4 ? style.listItemActive : style.listItem}
              sx={{
                '&:before': {
                  backgroundColor: statusColor('Отказ'),
                  border: `1px solid ${statusColor('Отказ')}`,
                },
              }}
            >
              <Typography variant="body2">Отказ</Typography>
            </ListItem>
          )}
        </List>
      ) : (
        <List className={style.list}>
          {initialSteps.map((el, index) => (
            <ListItem
              key={index}
              className={
                steps >= index + 1 ? style.listItemActive : style.listItem
              }
              sx={{
                '&:before': {
                  backgroundColor: statusColor(el),
                  border: `1px solid ${statusColor(el)}`,
                },
              }}
            >
              <Typography variant="body2">{el}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ProgressBar;
