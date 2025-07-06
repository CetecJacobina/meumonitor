fetch('../../components/sidebar.html')
  .then(res => res.text())
  .then(html => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.innerHTML = html;
  });
