import { Box, Typography } from '@mui/material';
import s from './TextAroundBlock.module.scss';

const TextAroundBlock = () => {
  return (
    <Box className={s.containerOfTextAround}>
      <Typography className={`${s.textAround} ${s.textPosition1}`}>
        Голосования и опросы с использованием технологии блок-чейн
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition2}`}>
        Маркетплейс специальных предложений от партнеров
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition3}`}>
        Электронный документооборот
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition4}`}>
        Постановка и учёт выполнения задач
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition5}`}>
        Конструктор оргструктуры, процессов и их автоматизация
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition6}`}>
        Инструменты краудсорсинга, краудфандинга и геймификации (награды,
        конкурсы)
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition7}`}>
        Учет участников и Единый цифровой паспорт общественного деятеля.
        Возможность работы в одном личном кабинете по нескольким организациям
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition8}`}>
        Личный кабинет работодателя для онлайн взаимодействия с общественными
        организациями
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition9}`}>
        Инструменты аналитики для организации и контролирующих органов
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition10}`}>
        Централизованные рассылки и уведомления
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition11}`}>
        Инструменты коммуникации и обмена знаниями (чат, видеоконференции,
        наставничество, база знаний)
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition12}`}>
        Защита персональных данных в соответствии с требованиями
        законодательства
      </Typography>
      <Typography className={`${s.textAround} ${s.textPosition13}`}>
        API для интеграции с 1С,
        <br /> платежными сервисами, внешними ИС
      </Typography>
    </Box>
  );
};

export default TextAroundBlock;
