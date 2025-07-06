/**
 * Converte string Date do Google (ex: "Date(2024,5,26)") para objeto Date
 * @param {string} rawDate 
 * @returns {Date|null}
 */
export function parseGoogleDate(rawDate) {
  try {
    const partes = rawDate.match(/\d+/g);
    const ano = Number(partes[0]);
    const mes = Number(partes[1]); // mês já começa em 0
    const dia = Number(partes[2]);
    const hora = Number(partes[3] ?? 0);
    const minuto = Number(partes[4] ?? 0);
    const segundo = Number(partes[5] ?? 0);

    return new Date(ano, mes, dia, hora, minuto, segundo);
  } catch {
    return null;
  }
}

/**
 * Converte objeto Date para string local: "dd/mm/yyyy hh:mm"
 * @param {Date} date 
 * @returns {string}
 */
export function formatarDataHora(date) {
  if (!(date instanceof Date)) return '–';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Converte número serial do Excel para Date
 * @param {number} serial 
 * @returns {Date}
 */
export function serialToDate(serial) {
  const ms = (serial - 25569) * 86400 * 1000;
  return new Date(ms);
}

/**
 * Formata número com 2 casas decimais
 * @param {number} num 
 * @returns {string}
 */
export function formatarNumero(num) {
  const n = Number(num);
  return isNaN(n) ? '–' : n.toFixed(2);
}
