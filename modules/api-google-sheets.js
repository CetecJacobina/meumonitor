/**
 * Busca dados da planilha pública do Google Sheets via gviz/tq
 * @returns {Promise<Array>} Array de objetos com os dados formatados
 */
export async function fetchSheetData() {
  const sheetID = '1NjVPD8BN_GEMKeuZvSXUAazFNcKNDJ0YwZjtvCAfE08';
  const sheetName = 'Dados';
  const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    const rows = json.table.rows;

    return rows.map(row => {
      const [dataRaw, sensor1, sensor2, sensor3] = row.c.map(cell => cell?.v ?? "");
      const dataFormatada = typeof dataRaw === 'string' && dataRaw.startsWith("Date")
        ? formatarDataGoogle(dataRaw)
        : dataRaw;

      return {
        data: dataFormatada,
        sensor1,
        sensor2,
        sensor3
      };
    });
  } catch (error) {
    console.error("Erro ao buscar dados da planilha:", error);
    return [];
  }
}

/**
 * Converte formato Date(2024,5,26) em string "26/06/2024"
 */
function formatarDataGoogle(dateStr) {
  const partes = dateStr.match(/\d+/g);
  const ano = partes[0];
  const mes = parseInt(partes[1]) + 1;
  const dia = partes[2];
  return `${dia}/${mes.toString().padStart(2, '0')}/${ano}`;
}
