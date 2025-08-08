import { IOption } from '@/models/Option';

export const OPTIONS_EDUCATION: IOption[] = [
  { title: 'Среднее общее', id: 'Среднее общее' },
  { title: 'Среднее профессиональное', id: 'Среднее профессиональное' },
  { title: 'Высшее', id: 'Высшее' },
  { title: 'Неоконченное высшее', id: 'Неоконченное высшее' },
];

export const OPTIONS_ROLES: IOption[] = [
  { title: 'Председатель', id: 'Председатель' },
  { title: 'Заместитель председателя', id: 'Заместитель председателя' },
  { title: 'Член профкома', id: 'Член профкома' },
  { title: 'Руководитель КРК', id: 'Руководитель КРК' },
  { title: 'Член КРК', id: 'Член КРК' },
  { title: 'Член профсоюза', id: 'Член профсоюза' },
];

export const OPTIONS_NEWS_STATUS: IOption[] = [
  { title: 'Опубликовано', id: 'published' },
  { title: 'Черновик', id: 'draft' },
];
