import { fetchSheetData } from '../../modules/api-google-sheets.js';
import { formatarNumero, formatarDataHora } from '../../modules/utils.js';

export async function renderCard() {
  const dados = await fetchSheetData();
  if (dados.length < 2) return; // Garante que há dados após o cabeçalho

  const ultimo = dados[1]; // Segunda linha = valor mais recente
  const dataObj = new Date(ultimo.data);

  const sensores = [
    { nome: 'Sensor 1', valor: Number(ultimo.sensor1) },
    { nome: 'Sensor 2', valor: Number(ultimo.sensor2) },
    { nome: 'Sensor 3', valor: Number(ultimo.sensor3) }
  ];

  let html = `
    <div class="card" style="border-left: 4px solid #007bff; padding: 1rem; margin-bottom: 1rem;">
      <h3>Última Leitura</h3>
      <p>Data/Hora: ${formatarDataHora(dataObj)}</p>
      <ul style="list-style: none; padding-left: 0;">
  `;

  sensores.forEach(sensor => {
    const status = (sensor.valor >= 400 && sensor.valor <= 800) ? 'Normal' : 'Atenção!';
    const color = status === 'Normal' ? 'green' : 'red';
    html += `
      <li>
        <strong>${sensor.nome}:</strong> ${formatarNumero(sensor.valor)} 
        <span style="color:${color}">(${status})</span>
      </li>`;
  });

  html += `
      </ul>
    </div>
  `;

  document.getElementById('status-card').innerHTML = html;
}

renderCard();
