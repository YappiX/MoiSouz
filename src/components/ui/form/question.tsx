import theme from '@/styles/theme';
import {
  Box,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { FC } from 'react';
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

interface IQuestionFieldsProps {
  name: string;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldValues | undefined;
  getValues: UseFormGetValues<{
    documentDate?: string | undefined;
    documentNumber?: string | undefined;
    questions?:
      | {
          document?: string | undefined;
          speaker: string;
          question: string;
        }[]
      | undefined;
    address: string;
  }>;
  setFormValue: UseFormSetValue<{
    documentDate?: string | undefined;
    documentNumber?: string | undefined;
    questions?:
      | {
          document?: string | undefined;
          speaker: string;
          question: string;
        }[]
      | undefined;
    address: string;
  }>;
  isMembersLoading: boolean;
  members: { role: string; name: string }[] | undefined;
  articlesL: number;
}

const QuestionFields: FC<IQuestionFieldsProps> = ({
  name,
  index,
  register,
  errors,
  getValues,
  setFormValue,
  isMembersLoading,
  members,
  articlesL,
}) => {
  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={1.6}>
      <InputLabel sx={{ marginBottom: '0' }}>
        {`Вопрос №${index + 1}`}{' '}
        <span
          style={
            !!errors?.question?.message
              ? { color: theme.palette.red.main }
              : { color: theme.palette.primary.main }
          }
        >
          *
        </span>
      </InputLabel>
      <TextField
        {...register(`${name}.${index}.question`)}
        multiline
        rows={3}
        placeholder="Вопрос"
        error={!!errors?.question?.message}
        helperText={errors?.question?.message || ''}
        disabled={index <= articlesL - 1}
      />
      <TextField
        {...register(`${name}.${index}.document`)}
        sx={{ display: 'none' }}
      />
      {!isMembersLoading && (
        <>
          <InputLabel sx={{ marginBottom: '0' }}>
            Докладчик{' '}
            <span
              style={
                !!errors?.speaker?.message
                  ? { color: theme.palette.red.main }
                  : { color: theme.palette.primary.main }
              }
            >
              *
            </span>
          </InputLabel>
          <Select
            fullWidth
            sx={{ padding: 1.6 }}
            name={`questions.${index}.speaker`}
            value={getValues(`questions.${index}.speaker`)}
            onChange={(e) => {
              setFormValue(
                `questions.${index}.speaker`,
                String(e.target.value),
              );
            }}
            error={!!errors?.speaker?.message}
          >
            {members &&
              members
                .filter((el) => el.role)
                .map((member) => (
                  <MenuItem key={member.name} value={member.name}>
                    {member.role + ' - ' + member.name}
                  </MenuItem>
                ))}
          </Select>
          {!!errors?.speaker?.message && (
            <FormHelperText sx={{ color: '#FF4949' }}>
              {errors?.speaker?.message}
            </FormHelperText>
          )}
        </>
      )}
    </Box>
  );
};

export default QuestionFields;
