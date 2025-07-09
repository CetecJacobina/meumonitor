export function getBasePath() {
  const host = window.location.hostname;
  if (host.includes("github.io")) {
    return "/meumonitor/";
  }
  return "../../";
}

// Mostrar na tela (caso exista o elemento com id="base-path")
const el = document.getElementById("base-path");
if (el) {
  el.textContent = `Base usada: ${getBasePath()}`;
}
