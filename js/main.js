/**
 * BREWLAB CAFE — CLIENT INTERACTION ENGINE
 * Handles dynamic products rendering, category filtering, lightbox video, modals & toast notices.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.coffikoI18n) window.coffikoI18n.init();
  initNavbar();
  initDynamicProducts();
  initTableBookingModal();
  initLightbox();
  initGalleryLightbox();
  initNewsletter();
  initToast();
  initPolicyModals();
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

    const isBn = (window.coffikoI18n ? window.coffikoI18n.currentLang : (localStorage.getItem('coffiko_lang') || 'bn')) === 'bn';

    if (filtered.length === 0) {
      const emptyMsg = isBn ? 'এই ক্যাটাগরিতে বর্তমানে কোনো কফি আইটেম পাওয়া যায়নি।' : 'No coffee items found in this roast category.';
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-600);">${emptyMsg}</div>`;
      return;
    }

    container.innerHTML = filtered.map(prod => {
      const pName = (isBn && prod.name_bn) ? prod.name_bn : prod.name;
      const pNotes = (isBn && prod.notes_bn) ? prod.notes_bn : prod.notes;
      const pBadge = (isBn && prod.badge_bn) ? prod.badge_bn : (prod.badge || 'Artisan');
      const btnText = isBn ? 'বুকিং দিন' : 'Booking Now';

      return `
      <div class="product-card hover-lift" data-id="${escapeHTML(prod.id)}">
        <div class="card-top">
          <span class="product-badge">${escapeHTML(pBadge)}</span>
          <img src="${escapeHTML(prod.image)}" alt="${escapeHTML(pName)}" class="product-thumb" loading="lazy" />
        </div>
        <div class="product-info">
          <h3>${escapeHTML(pName)}</h3>
          <p class="product-notes">${escapeHTML(pNotes)}</p>
        </div>
        <div class="card-bottom">
          <div class="product-price">৳${Number(prod.price).toLocaleString()}</div>
          <button class="btn-magnetic btn-order-quick" data-id="${escapeHTML(prod.id)}" data-name="${escapeHTML(pName)}" data-price="${prod.price}">
            ${btnText}
            <span class="btn-icon-circle">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
        </div>
      </div>
      `;
    }).join('');

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

  // Re-render when language toggles
  window.addEventListener('coffiko:lang-changed', () => {
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
function initToast() {
  // Lazily initialized container
}

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

// --- Legal & Store Policy Modals (Privacy, Terms, Booking/Return) ---
function initPolicyModals() {
  const modal = document.getElementById('policyModal');
  const titleEl = document.getElementById('policyModalTitle');
  const contentEl = document.getElementById('policyModalContent');
  const closeBtn = document.getElementById('closePolicyBtn');
  const policyLinks = document.querySelectorAll('.policy-link');

  if (!modal || !titleEl || !contentEl) return;

  const policies = {
    privacy: {
      title_en: 'Coffiko Privacy Policy',
      title_bn: 'কফিকো প্রাইভেসি পলিসি',
      body_en: `
        <p><strong>Effective Date:</strong> January 2026</p>
        <p>At Coffiko Roastery, your privacy is paramount. This policy details how we handle the information you provide during table reservations and store interactions.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">1. Information We Collect</h4>
        <p>We only collect the contact information (full name, phone number / WhatsApp, email, reservation date and guest count) that you voluntarily supply when reserving a table or subscribing to our coffee club.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">2. Zero Third-Party Sharing</h4>
        <p>We never sell, rent, or trade your personal data. All guest details remain strictly within our private database and are utilized solely for confirming lounge reservations, service updates, and exclusive club benefits.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">3. Direct Contact</h4>
        <p>If you have any questions or wish to delete your reservation record, reach out directly at <strong>info@coffiko.com</strong> or WhatsApp <strong>+880 1884-636312</strong>.</p>
      `,
      body_bn: `
        <p><strong>কার্যকর তারিখ:</strong> জানুয়ারি ২০২৬</p>
        <p>কফিকো রোস্টারিতে আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও সুরক্ষা আমাদের সর্বোচ্চ অগ্রাধিকার। টেবিল বুকিং ও সেবা গ্রহণের সময় প্রদত্ত তথ্য আমরা কীভাবে সংরক্ষণ করি তা নিচে ব্যাখ্যা করা হলো:</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">১. সংগৃহীত তথ্য</h4>
        <p>আমরা শুধুমাত্র আপনার নাম, ফোন / হোয়াটসঅ্যাপ নম্বর, ইমেইল, আগমনের তারিখ ও অতিথি সংখ্যা সংগ্রহ করি যা টেবিল বুকিং বা কফি ক্লাবে যুক্ত হওয়ার সময় আপনি নিজে প্রদান করেন।</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">২. জিরো থার্ড-পার্টি শেয়ারিং</h4>
        <p>আমরা কোনো তৃতীয় পক্ষের কাছে আপনার কোনো তথ্য বিক্রয়, ভাড়া বা শেয়ার করি না। আপনার তথ্য শুধুমাত্র লাউঞ্জ আসন নিশ্চিতকরণ ও কাস্টমার সাপোর্টের জন্য ব্যবহৃত হয়।</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">৩. সরাসরি যোগাযোগ</h4>
        <p>আপনার তথ্যের কোনো পরিবর্তন বা মুছে ফেলার অনুরোধ জানাতে সরাসরি ইমেইল করুন <strong>info@coffiko.com</strong> অথবা হোয়াটসঅ্যাপ করুন <strong>+৮৮০ ১৮৮৪-৬৩৬৩১২</strong> নম্বরে।</p>
      `
    },
    terms: {
      title_en: 'Terms & Lounge Conditions',
      title_bn: 'শর্তাবলী ও ক্যাফে নিয়মাবলী',
      body_en: `
        <p><strong>Welcome to Coffiko Artisan Roastery & Coffee Lounge.</strong> By visiting our lounge or reserving a table, you agree to the following terms:</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">1. Table Reservation & Grace Period</h4>
        <p>Reserved tables are held for up to 20 minutes past the scheduled arrival time. If you expect a delay, please notify us via WhatsApp so we can hold your seat.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">2. In-Lounge Experience & Dining Etiquette</h4>
        <p>We are a dedicated dine-in artisan coffee lounge celebrating quiet ambiance and specialty tasting sessions. We ask our guests to maintain a pleasant sound level and respect the shared space.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">3. Pricing & Billing</h4>
        <p>All prices displayed on the website are listed in Bangladeshi Taka (BDT) inclusive of applicable taxes.</p>
      `,
      body_bn: `
        <p><strong>কফিকো রোস্টারি ও ক্যাফে লাউঞ্জে স্বাগতম।</strong> আমাদের লাউঞ্জে আগমন বা টেবিল বুকিংয়ের ক্ষেত্রে নিম্নলিখিত শর্তাবলী প্রযোজ্য:</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">১. টেবিল বুকিং ও গ্রেস পিরিয়ড</h4>
        <p>বুকিংকৃত টেবিল নির্ধারিত সময়ের পর ২০ মিনিট পর্যন্ত সংরক্ষিত থাকে। বিলম্ব হলে অনুগ্রহ করে আমাদের হোয়াটসঅ্যাপে আগেই জানিয়ে দিন।</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">২. লাউঞ্জ পরিবেশ ও শিষ্টাচার</h4>
        <p>কফিকো একটি প্রিমিয়াম ডাইন-ইন স্পেশালিটি কফি লাউঞ্জ। শান্ত ও আনন্দদায়ক পরিবেশ বজায় রাখতে সবার সহযোগিতা কাম্য।</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">৩. মূল্য ও বিলিং</h4>
        <p>ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশি টাকায় (BDT) নির্ধারিত এবং প্রযোজ্য ভ্যাট অন্তর্ভুক্ত।</p>
      `
    },
    delivery: {
      title_en: 'Booking & Cancellation Policy',
      title_bn: 'বুকিং ও বাতিলকরণ পলিসি',
      body_en: `
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">1. Dine-In Reservation Policy (Not Home Delivery)</h4>
        <p>Coffiko provides direct artisanal lounge seating and live brewing experiences. We do not operate home delivery for hot coffee drinks to ensure optimal extraction taste profile.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">2. Free Cancellation & Rescheduling</h4>
        <p>We understand schedules change! You can reschedule or cancel your lounge reservation anytime up to 1 hour before your scheduled slot via WhatsApp or direct phone call with zero cancellation charges.</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">3. Artisan Roasted Beans Guarantee</h4>
        <p>Packaged roasted coffee beans purchased at our counter carry a 7-day roast-freshness exchange guarantee if the packaging seal is intact.</p>
      `,
      body_bn: `
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">১. ডাইন-ইন বুকিং পলিসি (হোম ডেলিভারি নয়)</h4>
        <p>কফিকো সরাসরি স্পেশালিটি লাউঞ্জে বসে প্রিমিয়াম কফির স্বাদ আস্বাদন করার স্থান। সর্বোচ্চ কোয়ালিটি ও সঠিক ফ্লেভার প্রোফাইল বজায় রাখতে আমরা হট কফি হোম ডেলিভারি করি না।</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">২. ফ্রি বুকিং পরিবর্তন ও বাতিল</h4>
        <p>যেকোনো জরুরি প্রয়োজনে বুকিং সময়ের ১ ঘণ্টা আগে হোয়াটসঅ্যাপ বা ফোন কলের মাধ্যমে সম্পূর্ণ বিনামূল্যে বুকিং রিশিডিউল বা বাতিল করা যাবে।</p>
        <h4 style="margin: 16px 0 8px; color: var(--brand-primary); font-family: var(--font-heading);">৩. রোস্টেড কফি বিনস গ্যারান্টি</h4>
        <p>আমাদের লাউঞ্জ থেকে কেনা প্যাকেজড বিনসের ক্ষেত্রে প্যাকেট অক্ষত থাকা সাপেক্ষে ৭ দিনের মধ্যে এক্সচেঞ্জ সুবিধা রয়েছে।</p>
      `
    }
  };

  function openPolicy(policyKey) {
    const isBn = (window.coffikoI18n ? window.coffikoI18n.currentLang : (localStorage.getItem('coffiko_lang') || 'bn')) === 'bn';
    const policy = policies[policyKey] || policies.privacy;
    titleEl.textContent = isBn ? policy.title_bn : policy.title_en;
    contentEl.innerHTML = isBn ? policy.body_bn : policy.body_en;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePolicy() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  policyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pKey = link.getAttribute('data-policy') || 'privacy';
      openPolicy(pKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closePolicy);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePolicy();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePolicy();
    }
  });
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
