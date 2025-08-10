const NUM_SENSORES = 2;
const INTERVALO_ATUALIZACAO = 10000;
const ALERTA_INTERVALO = 5 * 3 * 1000;

const PLANILHA_URL =
  "https://docs.google.com/spreadsheets/d/1hH43iTRpZwuAUQ2cTeI98ub1fOfKjLYcLBJ_SIkyqoI/gviz/tq?tqx=out:csv&sheet=status";

let charts = [];
let ultimoUptime = "";
let ultimoWifiUptime = "";
let alertaAtivo = false;
let alarmeTimer = null;

// Utilitário para limpar campos CSV
function limparCampo(campo) {
  return campo?.replace(/"/g, "").trim() || "N/A";
}

const ADC_MAX = 4095;
const BAR_MAX = 338;
const BAR_100 = 200;
// Nova constante de limite visual do gráfico
const LIMITE_GRAFICO_PERCENT = 169; // 300 bar = 150%


function adcParaBar(valorADC) {
  return (valorADC / ADC_MAX) * BAR_MAX;
}

function barParaPercentual(bar) {
  const percentual = (bar / BAR_100) * 100;
  return Math.min(LIMITE_GRAFICO_PERCENT, Math.round(percentual));
}



// Interpreta os dados brutos da planilha
function parseDadosPlanilha(linhas) {
  const dadosBrutos = linhas[1];
  const sensores = [];

  for (let i = 0; i < NUM_SENSORES; i++) {
    const valorADC = Number(limparCampo(dadosBrutos[i]));
    const bar = adcParaBar(valorADC);
    const percentual = barParaPercentual(bar);
    sensores.push({ bar: bar.toFixed(1), valor: percentual });
  }

  return {
    sensores,
    wifiStatus: limparCampo(dadosBrutos[3]),
    uptime: limparCampo(dadosBrutos[4]),
    wifiUptime: limparCampo(dadosBrutos[5]),
  };
}

// Cria dinamicamente os gráficos circulares
function criarGraficoCircular(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "grafico-wrapper";

  const canvas = document.createElement("canvas");
  canvas.id = `sensor${index}`;

  const valorLabel = document.createElement("div");
  valorLabel.className = "grafico-valor";
  valorLabel.id = `valor${index}`;
  valorLabel.textContent = "0%";

  wrapper.appendChild(canvas);
  wrapper.appendChild(valorLabel);
  document.getElementById("graficos").appendChild(wrapper);

  const ctx = canvas.getContext("2d");
  charts[index] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Valor", "Faltante"],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ["#007bff", "#e0e0e0"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      rotation: -135,
      circumference: 270,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  });
}

// Atualiza os gráficos apenas se o valor mudou
function atualizarGraficos(sensores) {
  sensores.forEach((sensor, i) => {
    const valor = sensor.valor;
    const chart = charts[i];

    const valorLimite = Math.min(valor, LIMITE_GRAFICO_PERCENT);
    chart.data.datasets[0].data = [valorLimite, LIMITE_GRAFICO_PERCENT - valorLimite];
    chart.update();

    const label = document.getElementById(`valor${i}`);
    label.textContent = `${valor}%`;
  });
}


// Atualiza os valores no painel lateral
function atualizarPainel({ sensores, uptime, wifiUptime }) {
  const valoresDiv = document.getElementById("valores");
  valoresDiv.innerHTML = "";

  sensores.forEach((sensor, i) => {
    const bar = parseFloat(sensor.bar);
    const valor = sensor.valor;

    let status = "Normal";
    if (bar < 175) status = "Baixo";
    else if (bar > 220) status = "Alto";

    const div = document.createElement("div");
    div.textContent = `Sensor ${i + 1}: ${valor}% (${bar} bar) - ${status}`;
    valoresDiv.appendChild(div);
  });

  document.getElementById("tempos").innerHTML =
    `Ligado: ${uptime}<br>Conectado: ${wifiUptime}`;
}



// Verifica se os tempos estão congelados → falha de conexão
function verificarConexao({ uptime, wifiUptime }) {
  const erro = document.getElementById("erro");

  if (uptime === ultimoUptime && wifiUptime === ultimoWifiUptime) {
    if (!alertaAtivo) {
      erro.classList.remove("oculto");
      charts.forEach((c) => (c.canvas.style.opacity = 0.4));
      alertaAtivo = true;

      alarmeTimer = setInterval(() => {
        const alarme = document.getElementById("alarme");
        if (alarme) alarme.play();
      }, ALERTA_INTERVALO);
    }
  } else {
    ultimoUptime = uptime;
    ultimoWifiUptime = wifiUptime;

    erro.classList.add("oculto");
    charts.forEach((c) => (c.canvas.style.opacity = 1));
    alertaAtivo = false;

    if (alarmeTimer) {
      clearInterval(alarmeTimer);
      alarmeTimer = null;
    }
  }
}

// Função principal de busca + atualização
async function buscarDados() {
  try {
    const resposta = await fetch(PLANILHA_URL);
    const texto = await resposta.text();
    const linhas = texto.trim().split("\n").map((l) => l.split(","));

    if (!linhas[1]) return;

    const dados = parseDadosPlanilha(linhas);

    atualizarGraficos(dados.sensores);
    atualizarPainel(dados);
    verificarConexao(dados);
  } catch (erro) {
    console.error("❌ Erro ao buscar dados:", erro);
  } finally {
    setTimeout(buscarDados, INTERVALO_ATUALIZACAO); // recursivo
  }
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < NUM_SENSORES; i++) criarGraficoCircular(i);
  buscarDados();
});
