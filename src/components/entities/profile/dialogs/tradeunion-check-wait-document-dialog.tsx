import React, { FC } from 'react';
import NewProfileDialog from '../newProfileDialog';

interface Props {
  open: boolean;
  setOpen?: (tf: boolean) => void;
}

export const TradeunionCheckWaitDocumentDialog: FC<Props> = ({
  open,
  setOpen,
}) => {
  return (
    <NewProfileDialog
      open={open}
      btn={['Перейти в документы']}
      link={['/documents?outgoing']}
      title="Для того, чтобы воспользоваться всеми функциями системы, дождитесь результатов рассмотрения заявления о вступлении в профсоюз"
      setOpen={setOpen}
    />
  );
};
