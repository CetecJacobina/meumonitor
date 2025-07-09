

import { fetchSheetData } from '../../modules/api-google-sheets.js';

export async function montarTabela() {
  const dados = await fetchSheetData();
    
  if (!dados.length) {
    document.getElementById('tabela').innerHTML = '<p>Nenhum dado disponível.</p>';
    return;
  }

  let html = `
    <table class="tabela-dados">
      <thead>
        <tr>
          <th>Data</th>
          <th>Sensor 1</th>
          <th>Sensor 2</th>
          <th>Sensor 3</th>
        </tr>
      </thead>
      <tbody>
  `;

  dados.forEach(item => {
    html += `
      <tr>
      
        <td>${item.data}</td>
        <td>${item.sensor1}</td>
        <td>${item.sensor2}</td>
        <td>${item.sensor3}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';

  document.getElementById('tabela').innerHTML = html;

}

// Executa ao carregar
montarTabela();
