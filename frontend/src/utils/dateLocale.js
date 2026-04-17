import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export function formatDate(date, formatStr, language) {
  if (language && language.startsWith('es')) {
    return format(date, formatStr, { locale: esLocale });
  }
  return format(date, formatStr);
}
