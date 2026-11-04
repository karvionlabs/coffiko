/**
 * BREWLAB ADMIN PANEL & CMS CONTROLLER
 * Full management interface for Products, Live Orders, Leads, and Settings.
 */

const AUTH_CONFIG = {
  REQUIRED_USER: 'coffiko',
  REQUIRED_PIN: '2026',
  SESSION_KEY: 'coffiko_admin_auth',
  USER_KEY: 'coffiko_admin_user'
};

document.addEventListener('DOMContentLoaded', () => {
  initAuthGateway();
  initAdminTabs();
  initProductModal();
  initSettingsForm();
});

function initAuthGateway() {
  const overlay = document.getElementById('adminAuthOverlay');
  const loginForm = document.getElementById('authLoginForm');
  const usernameInput = document.getElementById('authUsernameInput');
  const pinInput = document.getElementById('authPinInput');
  const errorMsg = document.getElementById('authErrorMsg');
  const loggedUserDisplay = document.getElementById('loggedUserDisplay');
  const btnLogout = document.getElementById('btnLogout');

  const isAuthenticated = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) === 'true';

  if (isAuthenticated) {
    if (overlay) overlay.style.display = 'none';
    const currentUser = sessionStorage.getItem(AUTH_CONFIG.USER_KEY) || AUTH_CONFIG.REQUIRED_USER;
    if (loggedUserDisplay) loggedUserDisplay.textContent = currentUser;
    renderDashboard();
  } else {
    if (overlay) overlay.style.display = 'flex';
    setTimeout(() => usernameInput?.focus(), 100);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredUser = (usernameInput?.value || '').trim().toLowerCase();
      const enteredPin = (pinInput?.value || '').trim();

      if (enteredUser === AUTH_CONFIG.REQUIRED_USER && enteredPin === AUTH_CONFIG.REQUIRED_PIN) {
        sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, 'true');
        sessionStorage.setItem(AUTH_CONFIG.USER_KEY, enteredUser);
        if (overlay) overlay.style.display = 'none';
        if (loggedUserDisplay) loggedUserDisplay.textContent = enteredUser;
        if (errorMsg) errorMsg.style.display = 'none';
        renderDashboard();
      } else {
        if (errorMsg) {
          errorMsg.style.display = 'block';
          errorMsg.textContent = 'ভুল ইউজারনেম বা পিন! ইউজারনেম: coffiko, সিকিউরিটি পিন দিন।';
        }
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.USER_KEY);
      window.location.reload();
    });
  }
}

function initAdminTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const tabs = document.querySelectorAll('.admin-tab-content');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      navItems.forEach(n => n.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      item.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) targetElement.classList.add('active');
    });
  });
}

function renderDashboard() {
  if (!window.brewlabStore) return;

  const products = window.brewlabStore.getProducts();
  const orders = window.brewlabStore.getOrders();
  const leads = window.brewlabStore.getLeads();

  // Update Stats
  const statProducts = document.getElementById('statTotalProducts');
  const statOrders = document.getElementById('statActiveOrders');
  const statRevenue = document.getElementById('statRevenue');
  const statLeads = document.getElementById('statTotalLeads');

  if (statProducts) statProducts.textContent = products.length;
  if (statOrders) statOrders.textContent = orders.filter(o => o.status !== 'Completed').length;
  if (statRevenue) {
    const rev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    statRevenue.textContent = '৳' + rev.toLocaleString();
  }
  if (statLeads) statLeads.textContent = leads.length;

  // Render Products Table
  renderProductsTable(products);

  // Render Orders Table
  renderOrdersTable(orders);

  // Render Leads Table
  renderLeadsTable(leads);
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: contain; background: #f8f5f1;">
          <div>
            <strong>${p.name}</strong><br>
            <span style="color: #6b7280; font-size: 12px;">${p.category}</span>
          </div>
        </div>
      </td>
      <td><strong>৳${Number(p.price).toLocaleString()}</strong></td>
      <td><span class="status-badge status-ready">${p.badge || 'Standard'}</span></td>
      <td>
        <button onclick="editProduct('${p.id}')" style="background: none; border: none; cursor: pointer; color: #2563eb; font-weight: 600; margin-right: 8px;">Edit</button>
        <button onclick="deleteProduct('${p.id}')" style="background: none; border: none; cursor: pointer; color: #dc2626; font-weight: 600;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.item}</td>
      <td><strong>৳${Number(o.total).toLocaleString()}</strong></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding: 4px 8px; border-radius: 6px; border: 1px solid #d1d5db; font-size: 13px;">
          <option value="Brewing" ${o.status === 'Brewing' ? 'selected' : ''}>Brewing</option>
          <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
          <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>${o.time || 'Recent'}</td>
    </tr>
  `).join('');
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  tbody.innerHTML = leads.map(l => `
    <tr>
      <td><strong>${l.email}</strong></td>
      <td>${l.date}</td>
      <td><span class="status-badge status-completed">Subscribed</span></td>
    </tr>
  `).join('');
}

// --- Product Modal & CRUD ---
function initProductModal() {
  const modal = document.getElementById('productModal');
  const openBtn = document.getElementById('btnAddProduct');
  const closeBtn = document.getElementById('btnCancelProduct');
  const form = document.getElementById('productForm');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('modalProductId').value = '';
      document.getElementById('modalTitle').textContent = 'Add New Coffee Item';
      modal.classList.add('show');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('modalProductId').value;
      const name = document.getElementById('prodName').value;
      const category = document.getElementById('prodCategory').value;
      const price = parseFloat(document.getElementById('prodPrice').value);
      const badge = document.getElementById('prodBadge').value;
      const notes = document.getElementById('prodNotes').value;
      const image = document.getElementById('prodImage').value || 'assets/images/product-roast-1.avif';

      window.brewlabStore.saveProduct({
        id: id || undefined,
        name,
        category,
        price,
        badge,
        notes,
        image,
        inStock: true
      });

      modal.classList.remove('show');
      renderDashboard();
    });
  }
}

window.editProduct = function(id) {
  const product = window.brewlabStore.getProducts().find(p => p.id === id);
  if (!product) return;

  document.getElementById('modalProductId').value = product.id;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodBadge').value = product.badge || '';
  document.getElementById('prodNotes').value = product.notes;
  document.getElementById('prodImage').value = product.image;

  document.getElementById('modalTitle').textContent = 'Edit Coffee Item';
  document.getElementById('productModal').classList.add('show');
};

window.deleteProduct = function(id) {
  if (confirm('Are you sure you want to remove this coffee from the menu?')) {
    window.brewlabStore.deleteProduct(id);
    renderDashboard();
  }
};

window.updateOrderStatus = function(id, status) {
  window.brewlabStore.updateOrderStatus(id, status);
  renderDashboard();
};

function initSettingsForm() {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  const current = window.brewlabStore.getSettings();
  if (document.getElementById('shopNameInput')) document.getElementById('shopNameInput').value = current.shopName || '';
  if (document.getElementById('announcementInput')) document.getElementById('announcementInput').value = current.announcement || '';
  if (document.getElementById('contactEmailInput')) document.getElementById('contactEmailInput').value = current.contactEmail || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.brewlabStore.saveSettings({
      shopName: document.getElementById('shopNameInput').value,
      announcement: document.getElementById('announcementInput').value,
      contactEmail: document.getElementById('contactEmailInput').value
    });
    alert('Settings successfully updated!');
  });
}
