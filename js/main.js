/**
 * BREWLAB CAFE — CLIENT INTERACTION ENGINE
 * Handles dynamic products rendering, category filtering, lightbox video, modals & toast notices.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDynamicProducts();
  initTableBookingModal();
  initLightbox();
  initGalleryLightbox();
  initNewsletter();
  initToast();
  initOwnerSecretTrigger();
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

// Security helper: sanitize dynamic strings to prevent XSS injection
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
      <div class="product-card hover-lift" data-id="${escapeHTML(prod.id)}">
        <div class="card-top">
          <span class="product-badge">${escapeHTML(prod.badge || 'Artisan')}</span>
          <img src="${escapeHTML(prod.image)}" alt="${escapeHTML(prod.name)}" class="product-thumb" loading="lazy" />
        </div>
        <div class="product-info">
          <h3>${escapeHTML(prod.name)}</h3>
          <p class="product-notes">${escapeHTML(prod.notes)}</p>
        </div>
        <div class="card-bottom">
          <div class="product-price">৳${Number(prod.price).toLocaleString()}</div>
          <button class="btn-magnetic btn-order-quick" data-id="${escapeHTML(prod.id)}" data-name="${escapeHTML(prod.name)}" data-price="${prod.price}">
            Booking Now
            <span class="btn-icon-circle">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach booking click listeners
    document.querySelectorAll('.btn-order-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        openBookingModal(name, price);
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

// --- Global Open Booking Modal Helper ---
function openBookingModal(itemName, itemPrice) {
  const modal = document.getElementById('bookingModal');
  const form = document.getElementById('tableBookingForm');
  const successBox = document.getElementById('bookingSuccessBox');
  const nameDisplay = document.getElementById('bookingItemNameDisplay');
  const priceDisplay = document.getElementById('bookingItemPriceDisplay');
  const hiddenName = document.getElementById('bookingHiddenItemName');
  const hiddenPrice = document.getElementById('bookingHiddenPrice');
  const dateInput = document.getElementById('bookingDateInput');

  if (!modal) return;

  // Reset views
  if (form) form.style.display = 'block';
  if (successBox) successBox.style.display = 'none';

  // Set date input min and default to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  // Populate selected item info
  const selectedName = itemName || 'Signature Coffee Tasting & Lounge Table';
  const selectedPrice = itemPrice ? Number(itemPrice) : 0;

  if (nameDisplay) nameDisplay.textContent = selectedName;
  if (priceDisplay) {
    priceDisplay.textContent = selectedPrice > 0 ? `মূল্য: ৳${selectedPrice.toLocaleString()} • আসন সংরক্ষণ ফ্রি` : 'আসন সংরক্ষণ • ফ্রি টেবিল বুকিং';
  }
  if (hiddenName) hiddenName.value = selectedName;
  if (hiddenPrice) hiddenPrice.value = selectedPrice;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// --- Table & Coffee Lounge Booking Controller ---
function initTableBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeBookingBtn');
  const doneBtn = document.getElementById('btnDoneBooking');
  const form = document.getElementById('tableBookingForm');
  const successBox = document.getElementById('bookingSuccessBox');
  const navBtn = document.getElementById('navBookingBtn');

  if (navBtn) {
    navBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal('Signature Coffee Tasting & Lounge Table', 0);
    });
  }

  function closeBooking() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeBooking);
  if (doneBtn) doneBtn.addEventListener('click', closeBooking);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBooking();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeBooking();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const itemName = document.getElementById('bookingHiddenItemName')?.value || 'Coffee Lounge Table';
      const itemPrice = parseFloat(document.getElementById('bookingHiddenPrice')?.value || '0');
      const dateVal = document.getElementById('bookingDateInput')?.value;
      const timeVal = document.getElementById('bookingTimeSelect')?.value;
      const guestsVal = document.getElementById('bookingGuestsSelect')?.value;
      const zoneVal = document.getElementById('bookingZoneSelect')?.value;
      const rawName = document.getElementById('bookingCustomerName')?.value.trim();
      const rawPhone = document.getElementById('bookingPhoneInput')?.value.trim();
      const rawNotes = document.getElementById('bookingNotesInput')?.value.trim();

      if (!rawName || !rawPhone || !dateVal) {
        showToast('⚠️ অনুগ্রহ করে আপনার নাম, ফোন নম্বর এবং তারিখ প্রদান করুন।');
        return;
      }

      const customerName = escapeHTML(rawName);
      const phone = escapeHTML(rawPhone);
      const notes = escapeHTML(rawNotes);

      const bookingData = {
        customerName,
        phone,
        item: itemName,
        total: itemPrice,
        date: dateVal,
        timeSlot: timeVal,
        guests: guestsVal,
        zone: zoneVal,
        notes: notes || 'কোনো বিশেষ নোট নেই'
      };

      let createdBooking = null;
      if (window.brewlabStore) {
        createdBooking = window.brewlabStore.createBooking(bookingData);
      } else {
        createdBooking = {
          id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
          ...bookingData
        };
      }

      // Populate Success Summary
      const summaryId = document.getElementById('resSummaryId');
      const summaryName = document.getElementById('resSummaryName');
      const summaryItem = document.getElementById('resSummaryItem');
      const summaryDateTime = document.getElementById('resSummaryDateTime');
      const summaryGuestsZone = document.getElementById('resSummaryGuestsZone');

      if (summaryId) summaryId.textContent = '#' + createdBooking.id;
      if (summaryName) summaryName.textContent = customerName;
      if (summaryItem) summaryItem.textContent = itemName;
      if (summaryDateTime) summaryDateTime.textContent = `${dateVal} | ${timeVal}`;
      if (summaryGuestsZone) summaryGuestsZone.textContent = `${guestsVal} • ${zoneVal}`;

      // Build WhatsApp Pre-filled message link to user's phone +8801884636312
      const waMsg = `Hello Coffiko! আমি একটি টেবিল বুকিং করেছি।\n\n📌 বুকিং আইডি: #${createdBooking.id}\n👤 নাম: ${rawName}\n📱 ফোন: ${rawPhone}\n☕ কফি/সেশন: ${itemName}\n📅 তারিখ: ${dateVal}\n⏰ সময়: ${timeVal}\n👥 অতিথি: ${guestsVal}\n🛋️ আসন: ${zoneVal}\n📝 বিশেষ অনুরোধ: ${rawNotes || 'নেই'}\n\nঅনুগ্রহ করে আমার বুকিং কনফার্ম করবেন। ধন্যবাদ!`;
      const waLink = `https://wa.me/8801884636312?text=${encodeURIComponent(waMsg)}`;
      const waBtn = document.getElementById('btnWhatsAppConfirmLink');
      if (waBtn) waBtn.href = waLink;

      // Switch views
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';

      showToast(`🎉 টেবিল বুকিং সম্পন্ন হয়েছে! আইডি: #${createdBooking.id}`);
      form.reset();
    });
  }
}

// --- Lightbox Video Modal ---
function initLightbox() {
  const trigger = document.getElementById('openVideoBtn');
  const modal = document.getElementById('videoLightbox');
  const closeBtn = document.getElementById('closeVideoBtn');
  const video = document.getElementById('lightboxVideo');

  if (!trigger || !modal) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
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

// --- Newsletter Subscription with Strict Validation & Anti-XSS ---
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const rawEmail = input ? input.value.trim() : '';

    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
    if (!rawEmail || !emailRegex.test(rawEmail) || rawEmail.length > 100) {
      showToast('⚠️ অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন।');
      return;
    }

    const cleanEmail = escapeHTML(rawEmail);

    if (window.brewlabStore) {
      window.brewlabStore.addLead(cleanEmail);
      showToast('🎉 Coffiko VIP ক্লাবে আপনাকে স্বাগতম! শীঘ্রই কনফার্মেশন পাবেন।');
      form.reset();
    }
  });
}

// --- Global Toast Notification (XSS-Safe) ---
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// --- Secret Owner Admin Trigger (Hidden from Public & Search Crawlers) ---
function initOwnerSecretTrigger() {
  // 1. Secret Hotkey: Ctrl + Shift + A (or Cmd + Shift + A)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      showToast('🔒 Owner Vault সিকিউরিটি গেটওয়ে ওপেন হচ্ছে...');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 500);
    }
  });

  // 2. Secret Gesture: Triple-click on footer emblem logo
  const footerLogo = document.querySelector('.footer-brand img');
  if (footerLogo) {
    let clickCount = 0;
    let clickTimer = null;
    footerLogo.style.cursor = 'default';
    footerLogo.title = '';
    footerLogo.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        clickCount = 0;
        showToast('🔒 Owner Vault সিকিউরিটি গেটওয়ে ওপেন হচ্ছে...');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 500);
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      }
    });
  }

  // 3. Secret Hash URL access check (e.g. index.html#vault or #admin)
  if (window.location.hash === '#vault' || window.location.hash === '#admin') {
    history.replaceState(null, null, ' ');
    window.location.href = 'admin.html';
  }
}
