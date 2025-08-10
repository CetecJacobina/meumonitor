import { fetchSheetData } from "../../modules/api-google-sheets.js";

const charts = {};

export async function renderGraficosRecentes() {
  const dados = await fetchSheetData();
  if (dados.length < 1) return;

  const ultimo = dados[0];

  const valores = {
    sensor1: Number(ultimo.sensor1),
    sensor2: Number(ultimo.sensor2),
    sensor3: Number(ultimo.sensor3),
  };

  desenharGraficoCircular('chart1', valores.sensor1, 'Sensor 1', '#007bff');
  desenharGraficoCircular('chart2', valores.sensor2, 'Sensor 2', '#28a745');
  desenharGraficoCircular('chart3', valores.sensor3, 'Sensor 3', '#dc3545');
}

function desenharGraficoCircular(id, valor, titulo, cor) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (charts[id]) {
    charts[id].destroy();
  }

  const porcentagem = Math.min(100, Math.max(0, (valor / 4096) * 100));
  const restante = 100 - porcentagem;

  charts[id] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [titulo, ''],
      datasets: [{
        data: [porcentagem, restante],
        backgroundColor: [cor, '#e0e0e0'],
        borderWidth: 1,
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
        title: {
          display: true,
          text: `${titulo}: ${porcentagem.toFixed(1)}%`
        }
      }
    }
  });
}
