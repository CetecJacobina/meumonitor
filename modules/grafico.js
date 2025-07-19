import { fetchSheetData } from "../../modules/api-google-sheets.js";

// Armazena os gráficos ativos para evitar recriação sobre o mesmo canvas
const charts = {};

export async function renderGraficos(limit =20) {
  const dados = await fetchSheetData();
  if (dados.length < 1) return;

  const recentes = dados.slice(0, limit + 1);

  const labels = recentes.map(d => d.data);
  const valores1 = recentes.map(d => Number(d.sensor1));
  const valores2 = recentes.map(d => Number(d.sensor2));
  const valores3 = recentes.map(d => Number(d.sensor3));

  desenharGrafico('chart1', labels, valores1, 'Sensor 1', '#007bff');
  desenharGrafico('chart2', labels, valores2, 'Sensor 2', '#28a745');
  desenharGrafico('chart3', labels, valores3, 'Sensor 3', '#dc3545');
}

function desenharGrafico(id, labels, dados, titulo, cor) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Se já existe um gráfico nesse canvas, destrói antes de criar outro
  if (charts[id]) {
    charts[id].destroy();
  }

  // Cria e armazena o novo gráfico
  charts[id] = new Chart(ctx, {
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
    animation: false, // 🔥 Desativa a animação
    scales: {
      y: { beginAtZero: false }
    }
  }
});
}