/**
 * BREWLAB CAFE — CLIENT INTERACTION ENGINE
 * Handles dynamic products rendering, category filtering, lightbox video, modals & toast notices.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDynamicProducts();
  initLightbox();
  initGalleryLightbox();
  initNewsletter();
  initToast();
});

// --- Sticky Navbar & Mobile Drawer ---
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }
}

// --- Dynamic Products & Category Filtering ---
function initDynamicProducts() {
  const container = document.getElementById('productsContainer');
  const filterPills = document.querySelectorAll('.cat-pill');
  if (!container) return;

  function render(categoryFilter = 'all') {
    const products = window.brewlabStore ? window.brewlabStore.getProducts() : [];
    const filtered = categoryFilter === 'all' 
      ? products 
      : products.filter(p => p.category === categoryFilter);

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-600);">No coffee items found in this roast category.</div>`;
      return;
    }

    container.innerHTML = filtered.map(prod => `
      <div class="product-card hover-lift" data-id="${prod.id}">
        <div class="card-top">
          <span class="product-badge">${prod.badge || 'Artisan'}</span>
          <img src="${prod.image}" alt="${prod.name}" class="product-thumb" loading="lazy" />
        </div>
        <div class="product-info">
          <h3>${prod.name}</h3>
          <p class="product-notes">${prod.notes}</p>
        </div>
        <div class="card-bottom">
          <div class="product-price">৳${Number(prod.price).toLocaleString()}</div>
          <button class="btn-magnetic btn-order-quick" data-id="${prod.id}" data-name="${prod.name}" data-price="${prod.price}">
            Order Now
            <span class="btn-icon-circle">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach order click listeners
    document.querySelectorAll('.btn-order-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        handleQuickOrder(id, name, price);
      });
    });
  }

  // Initial render
  render('all');

  // Filter click handling
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-category') || 'all';
      render(cat);
    });
  });

  // Re-render when store updates
  window.addEventListener('brewlab:products-updated', () => {
    const activePill = document.querySelector('.cat-pill.active');
    render(activePill ? activePill.getAttribute('data-category') : 'all');
  });
}

// --- Quick Order Action ---
function handleQuickOrder(id, name, price) {
  if (window.brewlabStore) {
    const newOrder = window.brewlabStore.createOrder({
      customerName: 'Online Guest',
      email: 'guest@brewlab.local',
      item: `${name} x 1`,
      total: price
    });
    showToast(`☕ অর্ডার নিশ্চিত হয়েছে! টিকিট: ${newOrder.id} (৳${Number(price).toLocaleString()})`);
  }
}

// --- Lightbox Video Modal ---
function initLightbox() {
  const trigger = document.getElementById('openVideoBtn');
  const modal = document.getElementById('videoLightbox');
  const closeBtn = document.getElementById('closeVideoBtn');
  const iframe = document.getElementById('lightboxIframe');

  if (!trigger || !modal) return;

  const videoUrl = "https://www.youtube-nocookie.com/embed/O6_z1_zLIOI?autoplay=1";

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (iframe) iframe.src = videoUrl;
    modal.classList.add('active');
  });

  function closeModal() {
    modal.classList.remove('active');
    if (iframe) iframe.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

// --- In-Page Gallery Lightbox (Zero External Redirects) ---
function initGalleryLightbox() {
  const modal = document.getElementById('imageLightbox');
  const previewImg = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeImageBtn');
  const cards = document.querySelectorAll('.gallery-card');

  if (!modal || !previewImg) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = card.getAttribute('data-img') || card.querySelector('img')?.src;
      const capText = card.getAttribute('data-caption') || card.querySelector('img')?.alt || 'Coffiko Artisan Moments';
      
      previewImg.src = imgSrc;
      if (caption) caption.textContent = capText;
      modal.classList.add('active');
    });
  });

  function closeGalleryModal() {
    modal.classList.remove('active');
    if (previewImg) previewImg.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeGalleryModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGalleryModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeGalleryModal();
  });
}

// --- Newsletter Subscription ---
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input ? input.value.trim() : '';
    if (email && window.brewlabStore) {
      window.brewlabStore.addLead(email);
      showToast('🎉 Welcome to Coffiko VIP Club! Check your inbox.');
      form.reset();
    }
  });
}

// --- Global Toast Notification ---
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
