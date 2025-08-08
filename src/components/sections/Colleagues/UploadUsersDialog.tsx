import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Icon } from '@/components/ui';
import { Form } from '@/components/entities/profile/form';
import { InputAutocomplete } from '@/components/ui/form';
import FilePickerDialog from '@/components/ui/dialog/FilePickerDialog';

//import { useQuery } from '@tanstack/react-query';
import { saveFormTUUsers, useFetchTUOwner } from '@/hooks/useTU';

import { ITradeUnionUploadUsersForm } from '@/models/TradeUnion';
import { IOption } from '@/models/Option';
import { ITradeUnion } from '@/models/TradeUnion';

const schema = yup
  .object({
    tradeunion: yup.number().required('Укажите организацию'),
  })
  .required();

interface IDialogProps {
  open: boolean;
  defaultTradeUnion?: ITradeUnion | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const UploadUsersDialog: FC<IDialogProps> = ({
  open,
  defaultTradeUnion,
  onClose,
  onSuccess,
}) => {
  const tuOwner = useFetchTUOwner();

  const tuList: IOption[] = useMemo(
    () => (tuOwner ? [{ id: tuOwner.id || 0, title: tuOwner.title }] : []),
    [tuOwner],
  );

  const [reseted, setReseted] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);

  const [openFilePicker, setOpenFilePicker] = useState<boolean>(false);
  const [filePicked, setFilePicked] = useState<File | null>(null);

  const methods = useForm<ITradeUnionUploadUsersForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // reset form on open
  useEffect(() => {
    if (open == false) {
      if (reseted == true) setReseted(false);
      return;
    }

    if (open == true) {
      if (reseted == false) {
        methods.reset();
        setFilePicked(null);
        setReseted(true);
      }
      if (defaultTradeUnion?.id != null)
        methods.setValue('tradeunion', defaultTradeUnion.id);
    }
  }, [methods, open, defaultTradeUnion]);

  useEffect(() => {
    if (filePicked == null) return;
    handleSubmit(onSubmit)();
  }, [filePicked]);

  // send
  const onSubmit = async (/*data: ITradeUnionUploadUsersForm*/) => {
    if (filePicked == null) {
      setOpenFilePicker(false);
      setTimeout(() => setOpenFilePicker(true));
      return;
    }

    // temp (upload !?)
    await saveFormTUUsers(filePicked);
    setFilePicked(null);

    // success
    if (onClose) onClose();
    setSuccess(true);
    if (onSuccess) onSuccess();
  };

  const handleFilePick = (file: File) => {
    setFilePicked(file);
    setOpenFilePicker(false);
  };

  return (
    <>
      <Dialog
        sx={{ width: '100%' }}
        open={open}
        onClose={isSubmitting ? undefined : onClose}
        PaperProps={{
          sx: {
            maxWidth: '630px',
            width: '100%',
          },
        }}
      >
        <IconButton
          sx={{ position: 'absolute', right: 10, top: 10 }}
          onClick={isSubmitting ? undefined : onClose}
        >
          <Icon name="close" />
        </IconButton>
        <Form
          loading={isSubmitting}
          buttonsCancel={[]}
          buttonsSubmit={[
            {
              text: 'Загрузить участников',
              icon: 'upload',
              sx: {
                marginTop: 6,
                width: 300,
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          ]}
          onSubmit={handleSubmit(onSubmit)}
          methods={methods}
          checkTradeUnionMember={false}
        >
          <Typography
            marginBottom={4}
            marginTop={2}
            textAlign="center"
            fontSize={18}
            fontWeight={600}
          >
            Загрузка участников профсоюза
          </Typography>

          <Box
            width={'100%'}
            m={'0 auto 32px'}
            display={'flex'}
            alignItems={'center'}
            gap={1.2}
            justifyContent={'center'}
            component={'a'}
            href="/members-template.xlsx"
            download
          >
            <img src="/images/xml.svg" alt="xml"></img>
            <Typography
              lineHeight={'27px'}
              fontSize={16}
              color="rgb(32, 34, 36)"
              fontWeight={600}
              alignItems={'center'}
            >
              Шаблон списка участников профсоюза
            </Typography>
          </Box>

          <InputAutocomplete
            name="tradeunion"
            label="Организация"
            placeholder="Выберите организацию"
            options={tuList}
          />
        </Form>
      </Dialog>

      <Dialog
        open={success}
        onClose={() => setSuccess(false)}
        PaperProps={{
          sx: {
            p: 4,
            gap: 2,
          },
        }}
      >
        <Typography variant="h3" textAlign={'center'}>
          Данные загружены
        </Typography>
      </Dialog>

      <FilePickerDialog
        open={openFilePicker}
        onPick={handleFilePick}
        onClose={() => setOpenFilePicker(false)}
        accept=".xls,.xlsx"
      />
    </>
  );
};
