import { renderAccountCard } from './components/accountCard.js';
import { renderAdminAccountCard } from './components/adminAccountCard.js';
import { dashboardStyles } from './styles/dashboard.js';
import { adminDashboardStyles } from './styles/adminDashboard.js';
import { websocketScript } from './scripts/websocket.js';
import { adminDashboardScript } from './scripts/adminDashboard.js';

export function renderDashboard(accounts) {
  const platforms = new Set(accounts.map(account => account.platform).filter(Boolean));

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Streaming Accounts Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>${dashboardStyles}</style>
      <script>${websocketScript}</script>
    </head>
    <body>
      <div class="container">
        <h1>Streaming Accounts Dashboard</h1>
        
        <div class="filters">
          <button class="filter-button active" data-platform="all">Todos</button>
          ${Array.from(platforms).map(platform => `
            <button class="filter-button" data-platform="${platform}">
              ${platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          `).join('')}
        </div>

        <div class="accounts-grid">
          ${accounts.map(account => renderAccountCard(account)).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}

export function renderAdminDashboard(accounts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Dashboard</title>
      <link href="https://fonts.googleapis. <boltAction type="file" filePath="src/views/templates.js">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>${adminDashboardStyles}</style>
      <script>${adminDashboardScript}</script>
    </head>
    <body>
      <div class="container">
        <h1>Panel de Administración</h1>
        
        <div class="form-container">
          <h2>Agregar Nueva Cuenta</h2>
          <form action="/admin/accounts" method="POST" class="new-account-form">
            <div class="form-group">
              <label>Nombre de la Cuenta</label>
              <input type="text" name="name" required placeholder="Netflix Account 1">
            </div>
            <div class="form-group">
              <label>URL del Servicio</label>
              <input type="url" name="url" required placeholder="https://www.netflix.com">
            </div>
            <div class="form-group">
              <label>Plataforma</label>
              <select name="platform" class="platform-select" required>
                <option value="netflix">Netflix</option>
                <option value="hbo">HBO</option>
                <option value="disney">Disney+</option>
                <option value="prime">Prime Video</option>
                <option value="spotify">Spotify</option>
                <option value="youtube">YouTube</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label>Icono</label>
              <div class="icon-select">
                <div class="icon-option" data-icon="🎬">🎬</div>
                <div class="icon-option" data-icon="📺">📺</div>
                <div class="icon-option" data-icon="🎵">🎵</div>
                <div class="icon-option" data-icon="🎮">🎮</div>
                <div class="icon-option" data-icon="📱">📱</div>
                <div class="icon-option" data-icon="💻">💻</div>
                <div class="icon-option" data-icon="🎯">🎯</div>
                <div class="icon-option" data-icon="🎨">🎨</div>
              </div>
              <input type="hidden" name="icon" id="selected-icon" value="🎬">
            </div>
            <div class="form-group">
              <label>Etiquetas (separadas por coma)</label>
              <input type="text" name="tags" placeholder="streaming, movies, series">
            </div>
            <div class="form-group">
              <label>Máximo de Usuarios Simultáneos</label>
              <input type="number" name="maxUsers" required value="1" min="1">
            </div>
            <button type="submit" class="add-button">Agregar Cuenta</button>
          </form>
        </div>

        <h2>Cuentas Existentes</h2>
        <div class="accounts-grid">
          ${accounts.map(account => renderAdminAccountCard(account)).join('')}
        </div>
      </div>

      <script>
        // Icon selector functionality
        document.querySelectorAll('.icon-option').forEach(option => {
          option.addEventListener('click', () => {
            document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            document.getElementById('selected-icon').value = option.dataset.icon;
          });
        });
      </script>
    </body>
    </html>
  `;
}