export const replaceLastDigits = (str: string, number: number): string => {
  number = number == null || number == 0 ? 1 : number;
  // Convertir el número en una cadena de texto con la cantidad de dígitos necesarios
  const numStr = number.toString().padStart(11, '0');

  // Obtener la subcadena de la cadena original sin los últimos 11 caracteres
  const prefix = str.slice(0, -11);

  // Concatenar la subcadena y el nuevo número
  const newStr = prefix + numStr;

  return newStr;
};

export const getNumericalPartInvoiceNumberHelper = (code: string): number => {
  const match = code.match(/\d+$/);
  return Number(match ? match[0] : 0);
};

export const validateHourHelper = (h: string): boolean => {
  // Expresión regular para validar el formato HH:mm
  const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (formatoHora.test(h)) return true;
  return false;
};

export const validateDateHelper = (f: string): boolean => {
  // Expresión regular para validar el formato YYYY-MM-DD
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

  // Validar la fecha con la expresión regular
  if (formatoFecha.test(f)) {
    // Convertir la fecha a un objeto Date para validar que sea una fecha válida
    const fechaObj = new Date(f);
    if (isNaN(fechaObj.getTime())) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export const generateOtpHelper = (): string => {
  let code = '000000';
  while (code == '000000') code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  return code;
};

export const getDayToday = (loadedAt: Date): number => {
  // Verifica si loadedAt es una fecha válida
  if (isNaN(loadedAt.getTime()) || !loadedAt || loadedAt == undefined) {
    console.error('loadedAt no es una fecha válida.');
    return 0;
  } else {
    const today = new Date();
    const differenceInMilliseconds = today.getTime() - loadedAt.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return differenceInDays;
  }
};

export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  return uuidRegex.test(str);
};
