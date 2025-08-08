export const defaultQuestions: {
  speaker: string;
  question: string;
  decided: string;
  document?: string;
  approved?: number;
  declined?: number;
  ignored?: number;
}[] = [
  {
    speaker: '',
    decided: 'Председательствующий на собрании',
    question: 'О выборе председательствующего на заседании',
  },
  {
    speaker: '',
    decided: 'Секретарь собрания',
    question: 'О выборе секретаря заседания',
  },
  {
    speaker: '',
    decided: 'Ответственный за подсчет голосов',
    question: 'О выборе ответственного за подсчет голосов',
  },
  {
    speaker: '',
    decided: 'Утвердить повестку заседания Профкома',
    question: 'Об утверждении повестки заседания Профкома',
  },
];

export const defaultOptions = [
  'Включить в члены профсоюза',
  'Отклонить заявление',
  'Исключить из членов профсоюза',
];
