export const stepTransformation = (str: string) => {
  let step = 0;
  switch (str) {
    case 'Ожидает отправки':
      step = 1;
      break;
    case 'Отправлено в профсоюз':
      step = 2;
      break;
    case 'На проверке профсоюзом':
      step = 3;
      break;
    case 'Решение положительное, ожидает передачи оригинала в Профсоюз':
      step = 4;
      break;
    case 'Отказ':
      step = 4;
      break;

    case 'Оригинал получен':
      step = 5;

      break;

    default:
      step = 0;
      break;
  }
  return step;
};

export const stepTransformationAg = (str: string) => {
  let step = 0;
  switch (str) {
    case 'Черновик':
      step = 1;
      break;
    case 'Ожидает отправки':
      step = 1;
      break;
    case 'Ожидает утверждения':
      step = 1;
      break;
    case 'На согласовании':
      step = 2;
      break;
    case 'Утверждено':
      step = 3;
      break;

    default:
      step = 0;
      break;
  }
  return step;
};
