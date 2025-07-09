import { renderCard } from './charts.js';
import { renderGraficos } from './grafico.js';
import { montarTabela } from './tabela.js';

function atualizarDashboard() {
  renderCard();
  renderGraficos(); // ⬅ nome correto
  montarTabela();
}

// Atualiza agora e depois a cada 4 segundos
atualizarDashboard();
setInterval(atualizarDashboard, 1000);
