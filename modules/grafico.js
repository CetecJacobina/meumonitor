import { fetchSheetData } from "../../modules/api-google-sheets.js";

export async function renderGraficos(limit = 24) {
  const dados = await fetchSheetData();
  if (dados.length < 2) return;

  const recentes = dados.slice(1, limit + 1); // Ignora cabeçalho

  const labels = recentes.map(d => d.data);
  const valores1 = recentes.map(d => Number(d.sensor1));
  const valores2 = recentes.map(d => Number(d.sensor2));
  const valores3 = recentes.map(d => Number(d.sensor3));

  desenharGrafico('chart1', labels, valores1, 'Sensor 1', '#007bff');
  desenharGrafico('chart2', labels, valores2, 'Sensor 2', '#28a745');
  desenharGrafico('chart3', labels, valores3, 'Sensor 3', '#dc3545');
}

function desenharGrafico(id, labels, dados, titulo, cor) {
  const ctx = document.getElementById(id)?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: titulo,
        data: dados,
        borderColor: cor,
        backgroundColor: cor + '33',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

renderGraficos(10);
