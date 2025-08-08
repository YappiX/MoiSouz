export const statusColor = (status?: string): string => {
  let color = '';
  switch (status) {
    case 'Ожидает отправки':
      color = 'rgb(255, 226, 153)';
      break;
    case 'Ожидает утверждения':
      color = 'rgb(255, 226, 153)';
      break;
    case 'Отправлено в профсоюз':
      color = 'rgb(121, 216, 191)';
      break;
    case 'Черновик':
      color = 'rgb(255, 226, 153)';
      break;
    case 'На согласовании':
      color = 'rgb(255, 226, 153)';
      break;
    case 'На проверке профсоюзом':
      color = 'rgb(255, 226, 153)';
      break;
    case 'Решение положительное, ожидает передачи оригинала в Профсоюз':
      color = 'rgb(121, 216, 191)';
      break;
    case 'Утверждено':
      color = 'rgb(121, 216, 191)';
      break;
    case 'Отказ':
      color = 'rgb(255, 152, 112)';
      break;
    case 'Отклонено':
      color = 'rgb(255, 152, 112)';
      break;
    default:
      color = 'rgb(121, 216, 191)';
      break;
  }
  return color;
};
