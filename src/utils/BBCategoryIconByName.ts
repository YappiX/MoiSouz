import { IconName } from '@/components/ui';

export const BBCategoryIconByName = (name: string): IconName => {
  let iconName: IconName = 'info';
  switch (name) {
    case 'Новогодние скидки':
      iconName = 'bb-percents';
      break;
    case 'Новинки':
      iconName = 'bb-new';
      break;
    case 'Техника и Электроника':
      iconName = 'bb-hd';
      break;
    case 'Товары':
      iconName = 'bb-shop';
      break;
    case 'Рестораны и доставка':
      iconName = 'bb-food';
      break;
    case 'Обучение':
      iconName = 'bb-educ';
      break;
    case 'Спорт':
      iconName = 'bb-sport';
      break;
    case 'Красота и Здоровье':
      iconName = 'bb-health';
      break;
    case 'Отдых':
      iconName = 'bb-relax';
      break;
    case 'Дети':
      iconName = 'bb-child';
      break;
    case 'Развлечения':
      iconName = 'bb-enjoy';
      break;
    case 'Услуги':
      iconName = 'bb-deals';
      break;
    default:
      iconName = 'info';
      break;
  }
  return iconName;
};
