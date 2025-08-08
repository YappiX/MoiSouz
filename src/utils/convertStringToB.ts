export function convertSizeToBites(size: string | number): number {
  if (typeof size === 'number') {
    // Если размер уже число, возвращаем его
    return size;
  }

  // Регулярное выражение для извлечения числовой части и единицы измерения
  const match = size.match(/^([\d.]+)\s*([KMGTP]?B)$/i);
  if (!match) {
    throw new Error('Неверный формат размера файла');
  }

  const numericValue = parseFloat(match[1]); // Числовая часть
  const unit = match[2].toUpperCase(); // Единица измерения (в верхнем регистре)

  // Множители для перевода в биты
  const multipliers: { [key: string]: number } = {
    B: 1, // Байты -> биты (1 байт = 8 бит)
    KB: 1 * 1024, // Килобайты -> биты
    MB: 1 * 1024 * 1024, // Мегабайты -> биты
    GB: 1 * 1024 * 1024 * 1024, // Гигабайты -> биты
    TB: 1 * 1024 * 1024 * 1024 * 1024, // Терабайты -> биты
    PB: 1 * 1024 * 1024 * 1024 * 1024 * 1024, // Петабайты -> биты
  };

  // Получаем множитель для единицы измерения
  const multiplier = multipliers[unit];
  if (!multiplier) {
    throw new Error('Неизвестная единица измерения');
  }

  // Возвращаем размер в битах
  return numericValue * multiplier;
}
