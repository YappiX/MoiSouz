import { INewDoc } from '@/models/Doc';

export const agendas: INewDoc[] = [
  {
    documentNumber: 'AG00001',
    data: {
      address: 'Место проведения 1',
      questions: [
        { question: 'Вопрос 1', speaker: 'Петров Сергей Васильевич' },
        { question: 'Вопрос 2', speaker: 'Иванов Иван Иванович' },
      ],
    },

    status: '',
    title: '',
    files: [],
    documentDate: '',
    documentType: '',
    folder: '',
    file: '',
    step: '',
  },
  {
    documentNumber: 'AG00003',
    data: {
      address: 'Место проведения 2',
      questions: [
        { question: 'Вопрос 1', speaker: 'Петров Сергей Васильевич' },
        { question: 'Вопрос 2', speaker: 'Иванов Иван Иванович' },
      ],
    },
    status: '',
    title: '',
    files: [],
    documentDate: '',
    documentType: '',
    folder: '',
    file: '',
    step: '',
  },
];
