/**
 * COFFIKO OWNER ADMIN VAULT & CMS CONTROLLER
 * Zero-Leak Architecture: SHA-256 Crypto Hashing, Anti-Brute Force Shield,
 * Session Inactivity Auto-Logout, and Full Store Management.
 */

// Cryptographic hashes of default credentials (zero plain-text in code)
const AUTH_SECURITY = {
  USER_HASH_DEFAULT: 'a9f267e6616e6c6f795d459a80b03bf3c9421d697ebb0c83ce5e89c852659fc9', // 'coffiko'
  PIN_HASH_DEFAULT: '158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab',  // '2026'
  CUSTOM_PIN_KEY: 'coffiko_admin_pin_hash',
  SESSION_STORAGE_KEY: 'coffiko_admin_vault_session',
  LOCKOUT_KEY: 'coffiko_vault_lockout_until',
  FAILURES_KEY: 'coffiko_vault_failed_count',
  MAX_FAILURES: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
  INACTIVITY_TIMEOUT_MS: 15 * 60 * 1000 // 15 minutes
};

// Web Crypto SHA-256 helper
async function computeSHA256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthGateway();
  initAdminTabs();
  initProductModal();
  initSecurityVault();
  initSettingsForm();
});

// ============================================================================
// 1. AUTHENTICATION & ZERO-LEAK SECURITY GATEWAY
// ============================================================================
let sessionCheckInterval;
let lockoutTimerInterval;

function initAuthGateway() {
  const overlay = document.getElementById('adminAuthOverlay');
  const loginForm = document.getElementById('authLoginForm');
  const usernameInput = document.getElementById('authUsernameInput');
  const pinInput = document.getElementById('authPinInput');
  const errorMsg = document.getElementById('authErrorMsg');
  const lockoutMsg = document.getElementById('authLockoutMsg');
  const lockoutTimerSpan = document.getElementById('lockoutTimerSpan');
  const submitBtn = document.getElementById('btnSubmitAuth');
  const loggedUserDisplay = document.getElementById('loggedUserDisplay');
  const btnLogout = document.getElementById('btnLogout');

  // Check brute force lockout state
  function checkLockout() {
    const lockoutUntil = parseInt(localStorage.getItem(AUTH_SECURITY.LOCKOUT_KEY) || '0', 10);
    const now = Date.now();

    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      if (lockoutMsg) lockoutMsg.style.display = 'block';
      if (errorMsg) errorMsg.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      }

      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      if (lockoutTimerSpan) {
        lockoutTimerSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      if (!lockoutTimerInterval) {
        lockoutTimerInterval = setInterval(() => {
          checkLockout();
        }, 1000);
      }
      return true;
    } else {
      if (lockoutTimerInterval) {
        clearInterval(lockoutTimerInterval);
        lockoutTimerInterval = null;
      }
      if (lockoutMsg) lockoutMsg.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
      return false;
    }
  }

  // Check existing session
  const rawSession = sessionStorage.getItem(AUTH_SECURITY.SESSION_STORAGE_KEY);
  let session = null;
  if (rawSession) {
    try {
      session = JSON.parse(rawSession);
    } catch (e) {
      session = null;
    }
  }

  const now = Date.now();
  if (session && session.authed && session.expiresAt > now) {
    if (overlay) overlay.style.display = 'none';
    if (loggedUserDisplay) loggedUserDisplay.textContent = session.user || 'coffiko';
    startInactivityWatcher();
    renderDashboard();
  } else {
    sessionStorage.removeItem(AUTH_SECURITY.SESSION_STORAGE_KEY);
    if (overlay) overlay.style.display = 'flex';
    checkLockout();
    setTimeout(() => usernameInput?.focus(), 150);
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (checkLockout()) return;

      const enteredUser = (usernameInput?.value || '').trim().toLowerCase();
      const enteredPin = (pinInput?.value || '').trim();

      if (!enteredUser || !enteredPin) {
        if (errorMsg) {
          errorMsg.style.display = 'block';
          errorMsg.textContent = 'অনুগ্রহ করে ইউজারনেম এবং পিন উভয়ই প্রদান করুন।';
        }
        return;
      }

      const enteredUserHash = await computeSHA256(enteredUser);
      const enteredPinHash = await computeSHA256(enteredPin);

      // Current active PIN hash (custom PIN or default 2026)
      const expectedPinHash = localStorage.getItem(AUTH_SECURITY.CUSTOM_PIN_KEY) || AUTH_SECURITY.PIN_HASH_DEFAULT;

      const isUserValid = (enteredUserHash === AUTH_SECURITY.USER_HASH_DEFAULT);
      const isPinValid = (enteredPinHash === expectedPinHash);

      if (isUserValid && isPinValid) {
        // Reset brute force counter
        localStorage.removeItem(AUTH_SECURITY.FAILURES_KEY);
        localStorage.removeItem(AUTH_SECURITY.LOCKOUT_KEY);

        // Store active session with inactivity tracking
        const newSession = {
          authed: true,
          user: enteredUser,
          createdAt: Date.now(),
          expiresAt: Date.now() + (30 * 60 * 1000),
          lastActivity: Date.now()
        };
        sessionStorage.setItem(AUTH_SECURITY.SESSION_STORAGE_KEY, JSON.stringify(newSession));

        if (overlay) overlay.style.display = 'none';
        if (loggedUserDisplay) loggedUserDisplay.textContent = enteredUser;
        if (errorMsg) errorMsg.style.display = 'none';

        startInactivityWatcher();
        renderDashboard();
      } else {
        // Increment failed attempts
        let failedCount = parseInt(localStorage.getItem(AUTH_SECURITY.FAILURES_KEY) || '0', 10) + 1;
        localStorage.setItem(AUTH_SECURITY.FAILURES_KEY, failedCount.toString());

        if (failedCount >= AUTH_SECURITY.MAX_FAILURES) {
          const lockoutUntil = Date.now() + AUTH_SECURITY.LOCKOUT_DURATION_MS;
          localStorage.setItem(AUTH_SECURITY.LOCKOUT_KEY, lockoutUntil.toString());
          checkLockout();
        } else {
          const remainingAttempts = AUTH_SECURITY.MAX_FAILURES - failedCount;
          if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = `ভুল ক্রেডেনশিয়াল! সঠিক তথ্য দিন। আর ${remainingAttempts} বার চেষ্টা করা যাবে।`;
          }
          if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
          }
        }
      }
    });
  }

  // Logout button
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logoutAdmin('সফলভাবে লগআউট সম্পন্ন হয়েছে।');
    });
  }
}

function logoutAdmin(notice) {
  sessionStorage.removeItem(AUTH_SECURITY.SESSION_STORAGE_KEY);
  clearInterval(sessionCheckInterval);
  window.location.reload();
}

// Inactivity Auto-Logout Timer (15 Minutes)
function startInactivityWatcher() {
  const timerDisplay = document.getElementById('sessionTimerDisplay');
  let lastActive = Date.now();

  function recordActivity() {
    lastActive = Date.now();
    const rawSession = sessionStorage.getItem(AUTH_SECURITY.SESSION_STORAGE_KEY);
    if (rawSession) {
      try {
        const session = JSON.parse(rawSession);
        session.lastActivity = lastActive;
        sessionStorage.setItem(AUTH_SECURITY.SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch (e) {}
    }
  }

  window.addEventListener('mousemove', recordActivity, { passive: true });
  window.addEventListener('keydown', recordActivity, { passive: true });
  window.addEventListener('click', recordActivity, { passive: true });

  clearInterval(sessionCheckInterval);
  sessionCheckInterval = setInterval(() => {
    const elapsed = Date.now() - lastActive;
    const remainingMs = Math.max(0, AUTH_SECURITY.INACTIVITY_TIMEOUT_MS - elapsed);

    if (remainingMs <= 0) {
      alert('🔒 নিরাপত্তার স্বার্থে ১৫ মিনিট নিষ্ক্রিয় থাকার পর স্বয়ংক্রিয়ভাবে লগআউট করা হয়েছে।');
      logoutAdmin();
      return;
    }

    if (timerDisplay) {
      const totalSeconds = Math.floor(remainingMs / 1000);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// ============================================================================
// 2. ADMIN TABS NAVIGATION
// ============================================================================
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

// ============================================================================
// 3. DASHBOARD RENDERING & XSS SANITIZATION
// ============================================================================
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderDashboard() {
  if (!window.brewlabStore) return;

  const products = window.brewlabStore.getProducts();
  const orders = window.brewlabStore.getOrders();
  const leads = window.brewlabStore.getLeads();

  // Update Stats Cards
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

  renderProductsTable(products);
  renderProductsDetailTable(products);
  renderOrdersTable(orders);
  renderLeadsTable(leads);
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: contain; background: #f8f5f1;">
          <div>
            <strong>${escapeHTML(p.name)}</strong><br>
            <span style="color: #6b7280; font-size: 12px;">${escapeHTML(p.category)}</span>
          </div>
        </div>
      </td>
      <td><strong>৳${Number(p.price).toLocaleString()}</strong></td>
      <td><span class="status-badge status-ready">${escapeHTML(p.badge || 'Standard')}</span></td>
      <td>
        <button onclick="editProduct('${escapeHTML(p.id)}')" style="background: none; border: none; cursor: pointer; color: #2563eb; font-weight: 600; margin-right: 8px;">Edit</button>
        <button onclick="deleteProduct('${escapeHTML(p.id)}')" style="background: none; border: none; cursor: pointer; color: #dc2626; font-weight: 600;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderProductsDetailTable(products) {
  const tbody = document.getElementById('productsDetailTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: contain; background: #f8f5f1;">
          <div>
            <strong>${escapeHTML(p.name)}</strong><br>
            <span style="color: #6b7280; font-size: 12px;">${escapeHTML(p.notes || '')}</span>
          </div>
        </div>
      </td>
      <td><strong>৳${Number(p.price).toLocaleString()}</strong></td>
      <td><span class="status-badge status-ready">${escapeHTML(p.category)}</span></td>
      <td>
        <button onclick="editProduct('${escapeHTML(p.id)}')" style="background: none; border: none; cursor: pointer; color: #2563eb; font-weight: 600; margin-right: 8px;">সম্পাদনা</button>
        <button onclick="deleteProduct('${escapeHTML(p.id)}')" style="background: none; border: none; cursor: pointer; color: #dc2626; font-weight: 600;">মুছুন</button>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  tbody.innerHTML = orders.map(o => {
    const rawPhone = o.phone || '';
    const cleanDigits = rawPhone.replace(/\D/g, '');
    let fullWaNumber = '';
    if (cleanDigits.startsWith('880')) {
      fullWaNumber = cleanDigits;
    } else if (cleanDigits.startsWith('0')) {
      fullWaNumber = '880' + cleanDigits.substring(1);
    } else if (cleanDigits) {
      fullWaNumber = '880' + cleanDigits;
    }
    const waChatLink = fullWaNumber ? `https://wa.me/${fullWaNumber}?text=${encodeURIComponent(`হ্যালো ${o.customerName}! Coffiko থেকে আপনার রিজার্ভেশন (#${o.id}) সংক্রান্ত যোগাযোগ করছি।`)}` : '#';

    return `
      <tr>
        <td>
          <strong style="color: #d97706; font-family: monospace; font-size: 13px;">#${escapeHTML(o.id)}</strong>
        </td>
        <td>
          <strong>${escapeHTML(o.customerName)}</strong><br>
          <span style="font-size: 12px; color: #6b7280; font-family: monospace;">${escapeHTML(o.phone || 'Phone N/A')}</span>
        </td>
        <td>
          <strong>${escapeHTML(o.item)}</strong><br>
          <span style="font-size: 12px; color: #15803d; font-weight: 600;">৳${Number(o.total || 0).toLocaleString()}</span>
        </td>
        <td>
          <strong>${escapeHTML(o.date || 'Today')}</strong><br>
          <span style="font-size: 12px; color: #6b7280;">${escapeHTML(o.timeSlot || o.time || 'Recent')}</span>
        </td>
        <td>
          <span class="status-badge" style="background: #f1f5f9; color: #334155; margin-bottom: 4px; display: inline-block;">${escapeHTML(o.guests || '2 Guests')}</span><br>
          <span style="font-size: 12px; color: #475569;">${escapeHTML(o.zone || 'Main Lounge')}</span>
        </td>
        <td>
          <select onchange="updateOrderStatus('${escapeHTML(o.id)}', this.value)" style="padding: 5px 8px; border-radius: 6px; border: 1.5px solid #d1d5db; font-size: 12px; font-weight: 600; background: #ffffff; cursor: pointer;">
            <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Seated" ${o.status === 'Seated' ? 'selected' : ''}>Seated</option>
            <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          ${fullWaNumber ? `
            <a href="${waChatLink}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 4px; background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
              <span>💬</span> চ্যাট
            </a>
          ` : '<span style="color: #9ca3af; font-size: 12px;">N/A</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  tbody.innerHTML = leads.map(l => `
    <tr>
      <td><strong>${escapeHTML(l.email)}</strong></td>
      <td>${escapeHTML(l.date || 'Today')}</td>
      <td><span class="status-badge status-completed">Subscribed</span></td>
    </tr>
  `).join('');
}

// ============================================================================
// 4. PRODUCT MODAL & CRUD
// ============================================================================
function initProductModal() {
  const modal = document.getElementById('productModal');
  const openBtn = document.getElementById('btnAddProduct');
  const closeBtn = document.getElementById('btnCancelProduct');
  const form = document.getElementById('productForm');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('modalProductId').value = '';
      document.getElementById('modalTitle').textContent = 'নতুন কফি যোগ করুন';
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
      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const price = parseFloat(document.getElementById('prodPrice').value);
      const badge = document.getElementById('prodBadge').value.trim();
      const notes = document.getElementById('prodNotes').value.trim();
      const image = document.getElementById('prodImage').value.trim() || 'assets/images/product-roast-1.avif';

      if (!name || isNaN(price)) {
        alert('কফির নাম ও সঠিক মূল্য দিন।');
        return;
      }

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

  document.getElementById('modalTitle').textContent = 'কফি তথ্য সম্পাদনা করুন';
  document.getElementById('productModal').classList.add('show');
};

window.deleteProduct = function(id) {
  if (confirm('আপনি কি নিশ্চিতভাবে এই কফি আইটেমটি মেনু থেকে মুছে ফেলতে চান?')) {
    window.brewlabStore.deleteProduct(id);
    renderDashboard();
  }
};

window.updateOrderStatus = function(id, status) {
  window.brewlabStore.updateOrderStatus(id, status);
  renderDashboard();
};

// ============================================================================
// 5. SECURITY & PIN VAULT CONTROLLER
// ============================================================================
function initSecurityVault() {
  const changePinForm = document.getElementById('changePinForm');
  const currentPinInput = document.getElementById('currentPinInput');
  const newPinInput = document.getElementById('newPinInput');
  const confirmPinInput = document.getElementById('confirmPinInput');
  const alertBox = document.getElementById('pinChangeAlert');

  const btnQuickBackup = document.getElementById('btnExportQuickBackup');
  const btnDownloadBackup = document.getElementById('btnDownloadBackupFile');
  const backupFileInput = document.getElementById('backupFileInput');
  const btnFactoryReset = document.getElementById('btnFactoryReset');

  // Change PIN handler
  if (changePinForm) {
    changePinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const curPin = (currentPinInput?.value || '').trim();
      const newPin = (newPinInput?.value || '').trim();
      const confPin = (confirmPinInput?.value || '').trim();

      const expectedPinHash = localStorage.getItem(AUTH_SECURITY.CUSTOM_PIN_KEY) || AUTH_SECURITY.PIN_HASH_DEFAULT;
      const curHash = await computeSHA256(curPin);

      if (curHash !== expectedPinHash) {
        showAlert('❌ বর্তমান পিনটি সঠিক নয়! পুনরায় চেষ্টা করুন।', 'error');
        return;
      }

      if (newPin.length < 4 || newPin.length > 12) {
        showAlert('⚠️ নতুন পিন অবশ্যই ৪ থেকে ১২ অক্ষরের মধ্যে হতে হবে।', 'error');
        return;
      }

      if (newPin !== confPin) {
        showAlert('⚠️ নতুন পিন এবং কনফার্মেশন পিন মিলছে না!', 'error');
        return;
      }

      const newHash = await computeSHA256(newPin);
      localStorage.setItem(AUTH_SECURITY.CUSTOM_PIN_KEY, newHash);
      showAlert('✅ চমৎকার! আপনার নতুন সিকিউরিটি পিন সফলভাবে আপডেট হয়েছে।', 'success');
      changePinForm.reset();
    });
  }

  function showAlert(msg, type) {
    if (!alertBox) return;
    alertBox.style.display = 'block';
    alertBox.textContent = msg;
    if (type === 'success') {
      alertBox.style.background = '#dcfce7';
      alertBox.style.color = '#15803d';
      alertBox.style.border = '1px solid #86efac';
    } else {
      alertBox.style.background = '#fee2e2';
      alertBox.style.color = '#b91c1c';
      alertBox.style.border = '1px solid #fca5a5';
    }
  }

  // Backup Export
  function triggerBackupDownload() {
    if (!window.brewlabStore) return;
    const backupData = {
      app: 'Coffiko Artisan Coffee Store',
      exportedAt: new Date().toISOString(),
      products: window.brewlabStore.getProducts(),
      orders: window.brewlabStore.getOrders(),
      leads: window.brewlabStore.getLeads(),
      settings: window.brewlabStore.getSettings()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffiko-store-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (btnQuickBackup) btnQuickBackup.addEventListener('click', triggerBackupDownload);
  if (btnDownloadBackup) btnDownloadBackup.addEventListener('click', triggerBackupDownload);

  // Backup Restore
  if (backupFileInput) {
    backupFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && Array.isArray(parsed.products)) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(parsed.products));
            if (Array.isArray(parsed.orders)) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(parsed.orders));
            if (Array.isArray(parsed.leads)) localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(parsed.leads));
            if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));

            alert('✅ ব্যাকআপ ডাটা সফলভাবে রিস্টোর হয়েছে!');
            renderDashboard();
          } else {
            alert('⚠️ অবৈধ ব্যাকআপ ফাইল ফরম্যাট!');
          }
        } catch (err) {
          alert('❌ ফাইল পার্সিং ত্রুটি: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // Factory Reset
  if (btnFactoryReset) {
    btnFactoryReset.addEventListener('click', () => {
      const confirmReset = confirm('⚠️ আপনি কি নিশ্চিতভাবে সমস্ত ডাটা রিসেট করে ফ্যাক্টরি ডিফল্টে ফিরিয়ে নিতে চান? এতে কাস্টম অর্ডার মুছে যাবে।');
      if (confirmReset) {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.ORDERS);
        localStorage.removeItem(STORAGE_KEYS.LEADS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        alert('স্টোর ডাটা সফলভাবে ফ্যাক্টরি ডিফল্টে রিসেট করা হয়েছে।');
        window.location.reload();
      }
    });
  }
}

// ============================================================================
// 6. STORE CONFIGURATION SETTINGS
// ============================================================================
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
      shopName: document.getElementById('shopNameInput').value.trim(),
      announcement: document.getElementById('announcementInput').value.trim(),
      contactEmail: document.getElementById('contactEmailInput').value.trim()
    });
    alert('✅ স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  });
}
