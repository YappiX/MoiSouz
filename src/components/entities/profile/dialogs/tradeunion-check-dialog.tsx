import React, { FC } from 'react';
import NewProfileDialog from '../newProfileDialog';

interface Props {
  open: boolean;
  setOpen?: (tf: boolean) => void;
}

export const TradeunionCheckDialog: FC<Props> = ({ open, setOpen }) => {
  return (
    <NewProfileDialog
      open={open}
      btn={['Вступить в профсоюз', 'Я уже в профсоюзе']}
      link={['/trade_union_member', '/membership']}
      title="Для того, чтобы воспользоваться всеми функциями системы, вступите в профсоюзную организацию или дождитесь положительного результата по Вашему заявлению"
      setOpen={setOpen}
    />
  );
};
