import React, { FC } from 'react';
import NewProfileDialog from '../newProfileDialog';

interface Props {
  open: boolean;
  setOpen?: (tf: boolean) => void;
  guidDocument: string;
}

export const TradeunionCheckHasDocumentDialog: FC<Props> = ({
  open,
  setOpen,
  guidDocument,
}) => {
  return (
    <NewProfileDialog
      open={open}
      btn={['Вступить в профсоюз', 'Я уже в профсоюзе']}
      link={[`/documents/drafts/${guidDocument}`, '/membership']}
      title="Для того, чтобы воспользоваться всеми функциями системы, вступите в профсоюзную организацию или дождитесь положительного результата по Вашему заявлению"
      setOpen={setOpen}
    />
  );
};
