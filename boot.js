// boot.js
function getBasePath() {
  const host = window.location.hostname;
  if (host.includes("github.io")) {
    return "/meumonitor/"; // ajuste conforme seu repositório no GitHub
  }
  return "../../"; // para Live Server, XAMPP, etc.
}

const base = getBasePath();

// CSS dinâmico
const css = document.createElement("link");
css.rel = "stylesheet";
css.href = base + "styles/main.css";
document.head.appendChild(css);

// Lista de scripts para carregar
const scripts = [
  "components/scripts/load-header.js",
  "components/scripts/load-footer.js",
  "components/scripts/load-sidebar.js",
  "modules/grafico.js",
  "modules/charts.js",
  "modules/tabela.js"
];

// Carregamento dinâmico de scripts ES6 (type module)
scripts.forEach(path => {
  const script = document.createElement("script");
  script.type = "module";
  script.src = base + path;
  document.body.appendChild(script);
});
