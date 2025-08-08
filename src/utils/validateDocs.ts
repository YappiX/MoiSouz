export const validateInn = (inn: string): string => {
  let message = '';
  const checkInnDigits = (inn: string, digits: number[]): number => {
    return (
      (digits.reduce((acc, item, index) => acc + item * Number(inn[index]), 0) %
        11) %
      10
    );
  };

  if (!inn.length) {
    message = 'Обязательное поле';
  } else if (/[^0-9]/.test(inn)) {
    message = 'ИНН состоит из цифр';
  } else if (![10, 12].includes(inn.length)) {
    message = 'ИНН состоит из 10 или 12 цифр';
  } else {
    switch (inn.length) {
      case 10:
        message =
          checkInnDigits(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]) === Number(inn[9])
            ? ''
            : 'Неверное контрольное число';
        break;
      case 12:
        message =
          checkInnDigits(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) ===
            Number(inn[10]) &&
          checkInnDigits(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) ===
            Number(inn[11])
            ? ''
            : 'Неверное контрольное число';
        break;
    }
  }
  return message;
};

export const validateBik = (bik: string): string => {
  let message = '';
  if (!bik.length) {
    message = 'Обязательное поле';
  } else if (/[^0-9]/.test(bik)) {
    message = 'БИК состоит из цифр';
  } else if (bik.length !== 9) {
    message = 'БИК состоит из 9 цифр';
  }
  return message;
};

export const validateKpp = (kpp: string): string => {
  let message = '';
  if (!kpp.length) {
    message = 'Обязательное поле';
  } else if (kpp.length !== 9) {
    message = 'КПП состоит из 9 цифр';
  } else if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
    message = 'Неверный формат';
  }
  return message;
};

export const validateOgrn = (ogrn: string): string => {
  let message = '';
  if (!ogrn.length) {
    message = 'Обязательное поле';
  } else if (/[^0-9]/.test(ogrn)) {
    message = 'ОГРН состоит из цифр';
  } else if (ogrn.length !== 13) {
    message = 'ОГРН состоит из 13 цифр';
  } else {
    message =
      parseInt((parseInt(ogrn.slice(0, -1)) % 11).toString().slice(-1)) ===
      parseInt(ogrn[12])
        ? ''
        : 'Неверное контрольное число';
  }
  return message;
};

export const ValidateKsOrRs = (ks: string): string => {
  let message = '';
  if (!ks.length) {
    message = 'Обязательное поле';
  } else if (/[^0-9]/.test(ks)) {
    message = 'Счет состоит из цифр';
  } else if (ks.length !== 20) {
    message = 'Счет состоит из 20 цифр';
  }
  return message;
};

export const ValidateOktmo = (oktmo: string): string => {
  let message = '';
  if (!oktmo.length) {
    message = 'Обязательное поле';
  } else if (/[^0-9]/.test(oktmo)) {
    message = 'ОКТМО состоит из цифр';
  } else if (![8, 11].includes(oktmo.length)) {
    message = 'ОКТМО состоит из 8 или 11 цифр';
  }
  return message;
};
