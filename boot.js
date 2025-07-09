function getBasePath() {
  const host = window.location.hostname;
  if (host.includes("github.io")) {
    return "/meumonitor/";
  }
  return "../../";
}

const base = getBasePath();

// Adiciona o CSS principal
const css = document.createElement("link");
css.rel = "stylesheet";
css.href = base + "styles/main.css";
document.head.appendChild(css);

// Scripts que precisam ser carregados primeiro
const scripts = [
  "components/scripts/load-header.js",
  "components/scripts/load-footer.js",
  "components/scripts/load-sidebar.js",
  "modules/grafico.js",
  "modules/charts.js",
  "modules/tabela.js"
];

// Carrega todos os scripts como módulos
Promise.all(
  scripts.map(path => {
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = base + path;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  })
).then(() => {
  // Agora sim, importa o atualizador após os módulos estarem prontos
  import(base + "modules/atualizador.js");
});
