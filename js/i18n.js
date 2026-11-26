/**
 * COFFIKO MULTILINGUAL (I18N) ENGINE
 * Provides complete, pure Bengali (বাং) and English (EN) language switching
 * with zero mixed-language fragments.
 */

const COFFIKO_TRANSLATIONS = {
  en: {
    // Navbar
    'nav.about': 'About Us',
    'nav.products': 'Products',
    'nav.benefits': 'Benefits',
    'nav.testimonials': 'Testimonials',
    'nav.gallery': 'Gallery',
    'nav.whatsapp': 'WhatsApp',
    'nav.booking_btn': 'Booking Now',

    // Hero Section
    'hero.badge': '100% Organic & Ethically Sourced',
    'hero.title': 'Pure Coffee Taste, <br /><span class="accent">New Journey</span>',
    'hero.desc': 'Cleveland-based specialty coffee house roasting premium hand-picked beans from the finest high-altitude micro-lots around the globe.',
    'hero.btn_products': 'Our Products',
    'hero.btn_video': 'Watch Story',
    'hero.rating_val': 'Rated 4.9 / 5.0',
    'hero.rating_sub': 'Over 12,000+ happy drinkers',

    // Category Strip
    'cat.all': 'All Roasts',
    'cat.bundles': 'Shop Bundles',
    'cat.dark': 'Dark Roast',
    'cat.organic': 'Shop Organic',
    'cat.cold': 'Cold Brews',

    // Products Section Header
    'products.subtitle': 'Popular Flavors',
    'products.title': 'Fresh Coffee & Organic Beans',
    'products.desc': 'Handcrafted and roasted in micro-batches for peerless flavor fidelity. Select your favorite brew and reserve a table session at our lounge.',
    'products.empty': 'No coffee items found in this roast category.',

    // About Section
    'about.subtitle': 'Our Heritage',
    'about.title': 'Crafted With Passion & Precision',
    'about.p1': 'Founded in Cleveland, Coffiko began with a singular mission: to bring single-origin purity and scientific precision to every cup.',
    'about.p2': 'We partner directly with sustainable coffee farmers across Ethiopia, Colombia, and Guatemala to ensure living wages and ecologically protected farming practices.',
    'about.stat_num': '12+',
    'about.stat_label': 'Years of Artisan Roasting',
    'about.feat_1': '100% Direct Fair-Trade Certified Sourcing',
    'about.feat_2': 'Small-Batch Drum Roasting for Peak Aroma',
    'about.feat_3': 'Nitrogen-Flushed Packaging for Unrivaled Freshness',

    // Marquee Strip
    'marquee.text': 'Fresh Batch • Artisanal Roast • Ethically Sourced • Single Origin • Cold Brew Masterpiece • Pour-Over Excellence • 100% Organic Arabica • Micro-Lot Craft • ',

    // Benefits Section
    'benefits.subtitle': 'Why Choose Coffiko',
    'benefits.title': 'Perfection in Every Pour',
    'benefits.desc': 'We control every stage of our coffee journey—from origin farm cherry selection to precise fluid-bed and drum roasting.',
    'benefits.card1_title': 'Ethically Sourced',
    'benefits.card1_desc': 'Direct trade partnerships guaranteeing living wages to micro-lot coffee cultivators worldwide.',
    'benefits.card2_title': 'Micro-Batch Roast',
    'benefits.card2_desc': 'Roasted in calibrated small batches every Tuesday and Friday to guarantee unrivaled aroma and crema.',
    'benefits.card3_title': 'Artisan Baristas',
    'benefits.card3_desc': 'Certified specialty coffee association professionals crafting your pour-overs and espresso beverages.',

    // Testimonials Section
    'testimonials.subtitle': 'Customer Love',
    'testimonials.title': 'What Our Regulars Say',
    'testimonials.desc': 'Discover why passionate coffee connoisseurs and daily drinkers call Coffiko their sanctuary.',
    'testimonials.t1_quote': '"The Iced Hazelnut Latte is hands-down the best cold beverage in town. You can immediately taste the freshness of the beans and the artisanal oat milk."',
    'testimonials.t1_role': 'Architect & Coffee Enthusiast',
    'testimonials.t2_quote': '"Their small-batch roasts have completely elevated my home pour-over routine. Balanced acidity, rich aroma, and incredibly fast delivery."',
    'testimonials.t2_role': 'Creative Director',
    'testimonials.t3_quote': '"The consistency in taste and ethical fair-trade sourcing across every single order is unmatched. Coffiko is our team\'s daily go-to ritual. Warm ambiance, incredible baristas, and pure liquid gold!"',
    'testimonials.t3_role': 'Software Architect & Tech Lead',

    // Gallery Section
    'gallery.subtitle': 'Cafe Moments',
    'gallery.title': 'Life Around Coffiko',
    'gallery.desc': 'Follow our daily roasting journey, pour-over rituals, and vibrant cafe atmosphere on Instagram @coffiko.cafe.',

    // Newsletter Section
    'newsletter.subtitle': 'VIP Coffee Club',
    'newsletter.title': 'Join The Coffiko Inner Circle',
    'newsletter.desc': 'Subscribe for secret single-origin drop announcements, free brewing guides, and 15% off your first lounge reservation.',
    'newsletter.placeholder': 'Enter your email address...',
    'newsletter.btn': 'Join Club',

    // Footer
    'footer.brand_desc': 'Cleveland\'s premier specialty coffee house and artisan micro-roastery. Ethically sourced beans, scientifically roasted to perfection.',
    'footer.col_direct': 'Direct Connect',
    'footer.col_pages': 'Legal & Pages',
    'footer.coffee_menu': 'Coffee Menu',
    'footer.style_guide': 'Style Guide',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.delivery': 'Delivery & Return',
    'footer.rights': '© 2026 Coffiko Roastery Inc. All rights reserved.',
    'footer.design_system': 'Design System',

    // Booking Modal
    'booking.modal_badge': '☕ TABLE & COFFEE LOUNGE RESERVATION',
    'booking.modal_title': 'Reserve Your Experience',
    'booking.modal_desc': 'Not home delivery — reserve advance seating for an artisan coffee tasting session directly at our cafe lounge.',
    'booking.lbl_date': '📅 Date of Arrival',
    'booking.lbl_time': '⏰ Arrival Time Slot',
    'booking.lbl_guests': '👥 Number of Guests',
    'booking.lbl_zone': '🛋️ Seating Area Preference',
    'booking.lbl_name': '👤 Your Full Name',
    'booking.lbl_phone': '📱 Mobile / WhatsApp Number',
    'booking.lbl_notes': '📝 Special Requests (Optional)',
    'booking.btn_submit': '✨ Confirm Booking',
    'booking.footer_note': '🔒 Zero advance fee. Your booking confirmation is dispatched instantly via WhatsApp.',
    'booking.success_title': 'Table Reservation Confirmed!',
    'booking.success_desc': 'Your seats and coffee experience have been reserved. Reference details below:',
    'booking.btn_whatsapp': '💬 Send Instant WhatsApp Confirmation',
    'booking.btn_done': 'Done'
  },

  bn: {
    // Navbar
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.products': 'কফি মেনু',
    'nav.benefits': 'বিশেষত্ব',
    'nav.testimonials': 'রিভিউ',
    'nav.gallery': 'গ্যালারি',
    'nav.whatsapp': 'হোয়াটসঅ্যাপ',
    'nav.booking_btn': 'বুকিং দিন',

    // Hero Section
    'hero.badge': '১০০% অর্গানিক ও প্রিমিয়াম রোস্ট',
    'hero.title': 'কফির খাঁটি স্বাদ, <br /><span class="accent">নতুন এক যাত্রা</span>',
    'hero.desc': 'সেরা জাতের অ্যারাবিকা কফি বিন ও স্পেশাল কোল্ড ব্রিউ নিয়ে তৈরি আমাদের ক্যাফে লাউঞ্জ। প্রতিটি কাপে খাঁটি স্বাদ ও পরিপূর্ণ তৃপ্তি।',
    'hero.btn_products': 'কফি মেনু দেখুন',
    'hero.btn_video': 'ভিডিও দেখুন',
    'hero.rating_val': 'রেটিং ৪.৯ / ৫.০',
    'hero.rating_sub': '১২,০০০+ সন্তুষ্ট কফি প্রেমী',

    // Category Strip
    'cat.all': 'সব কফি',
    'cat.bundles': 'স্পেশাল বান্ডেল',
    'cat.dark': 'ডার্ক রোস্ট',
    'cat.organic': 'অর্গানিক বিন্স',
    'cat.cold': 'কোল্ড ব্রিউ',

    // Products Section Header
    'products.subtitle': 'জনপ্রিয় ফ্লেভারসমূহ',
    'products.title': 'তাজা রোস্টেড কফি ও স্পেশাল আইটেম',
    'products.desc': 'প্রতিদিন ছোট ছোট ব্যাচে রোস্ট করা তাজা ও সুস্বাদু কফি। আপনার পছন্দের কফি নির্বাচন করে ক্যাফে লাউঞ্জে সরাসরি আসন বুকিং করুন।',
    'products.empty': 'এই ক্যাটাগরিতে বর্তমানে কোনো কফি আইটেম পাওয়া যায়নি।',

    // About Section
    'about.subtitle': 'আমাদের ঐতিহ্য',
    'about.title': 'নিখুঁত ভালোবাসায় সেরা কফি প্রস্তুতি',
    'about.p1': 'একটি স্বপ্ন নিয়ে কফিকোর যাত্রা শুরু: বিশ্বের সেরা কফি ফার্ম থেকে সংগৃহীত সিঙ্গেল-অরিজিন কফি বিন প্রতিটি কাপে পরিবেশন করা।',
    'about.p2': 'আমরা ইথিওপিয়া, কলম্বিয়া ও গুয়াতেমালার টেকসই চাষীদের সাথে সরাসরি কাজ করি, যাতে কৃষকের ন্যায্য মূল্য ও পরিবেশবান্ধব উৎপাদন নিশ্চিত থাকে।',
    'about.stat_num': '১২+',
    'about.stat_label': 'বছরের প্রিমিয়াম রোস্টিং অভিজ্ঞতা',
    'about.feat_1': '১০০% সরাসরি ফেয়ার-ট্রেড সার্টিফাইড সোর্সিং',
    'about.feat_2': 'সেরা সুবাস নিশ্চিত করতে স্মল-ব্যাচ ড্রাম রোস্টিং',
    'about.feat_3': 'অনবদ্য সতেজতা ধরে রাখতে নাইট্রোজেন-ফ্লাশড প্যাক',

    // Marquee Strip
    'marquee.text': 'তাজা কফি • হস্তনির্মিত রোস্ট • সরাসরি কৃষক থেকে সংগৃহীত • খাঁটি স্বাদ • স্পেশাল কোল্ড ব্রিউ • নিখুঁত পোর-ওভার • ১০০% অ্যারাবিকা • প্রিমিয়াম লাউঞ্জ • ',

    // Benefits Section
    'benefits.subtitle': 'কেন কফিকো বেছে নেবেন',
    'benefits.title': 'প্রতিটি কাপে নিখুঁত স্বাদ ও অনুভূতি',
    'benefits.desc': 'কফি চেরি বাছাই থেকে শুরু করে নিখুঁত রোস্টিং—প্রতিটি ধাপে আমরা সর্বোচ্চ মান ও স্বাদ বজায় রাখি।',
    'benefits.card1_title': 'সরাসরি চাষী থেকে সংগৃহীত',
    'benefits.card1_desc': 'বিশ্বসেরা কফি বাগান থেকে সরাসরি সংগৃহীত সিঙ্গেল-অরিজিন প্রিমিয়াম কফি বিন্স।',
    'benefits.card2_title': 'স্মল-ব্যাচ রোস্টিং',
    'benefits.card2_desc': 'সপ্তাহে দুই দিন নিখুঁত তাপমাত্রায় রোস্ট করা হয় যাতে সর্বোচ্চ অ্যারোমা বজায় থাকে।',
    'benefits.card3_title': 'অভিজ্ঞ বারিস্তা টিম',
    'benefits.card3_desc': 'আন্তর্জাতিক মানের প্রশিক্ষণপ্রাপ্ত বারিস্তারা প্রস্তুত করেন প্রতিটি এস্প্রেসো ও ব্রিউ।',

    // Testimonials Section
    'testimonials.subtitle': 'অতিথিদের ভালোবাসা',
    'testimonials.title': 'আমাদের নিয়মিত অতিথিরা যা বলেন',
    'testimonials.desc': 'জেনে নিন কেন কফি প্রেমী ও নিয়মিত অতিথিরা কফিকোকে তাদের পছন্দের সেরা স্থান বলেন।',
    'testimonials.t1_quote': '"আইসড হ্যাজেলনাট ল্যাটে এই শহরের সেরা রিফ্রেশিং ড্রিংক। এক চুমুকেই কফি বিনের তাজা সুবাস এবং নিখুঁত স্বাদ স্পষ্ট বোঝা যায়।"',
    'testimonials.t1_role': 'আর্কিটেক্ট ও কফি অনুরাগী',
    'testimonials.t2_quote': '"তাদের স্মল-ব্যাচ রোস্টেড কফি বিন আমার প্রতিদিনের সকালের পোর-ওভারের অভিজ্ঞতা সম্পূর্ণ বদলে দিয়েছে। দারুণ সুবাস ও স্মুথ ব্যালান্স।"',
    'testimonials.t2_role': 'ক্রিয়েটিভ ডিরেক্টর',
    'testimonials.t3_quote': '"প্রতিটি ভিজিটে কফির স্বাদের ধারাবাহিকতা সত্যিই প্রশংসনীয়। কফিকো আমাদের টিমের প্রতিদিনের আড্ডার প্রিয় স্থান। আন্তরিক পরিবেশ এবং অসাধারণ স্বাদ!"',
    'testimonials.t3_role': 'সফটওয়্যার আর্কিটেক্ট ও টেক লিড',

    // Gallery Section
    'gallery.subtitle': 'ক্যাফে মোমেন্টস',
    'gallery.title': 'কফিকো লাউঞ্জের কিছু মুহূর্ত',
    'gallery.desc': 'আমাদের রোস্টিং অভিজ্ঞতা, কফি তৈরির মুহূর্ত এবং লাউঞ্জের মনোরম পরিবেশ দেখতে চোখ রাখুন @coffiko.cafe এ।',

    // Newsletter Section
    'newsletter.subtitle': 'ভিআইপি কফি ক্লাব',
    'newsletter.title': 'কফিকো ভিআইপি ক্লাবে যুক্ত হোন',
    'newsletter.desc': 'নতুন স্পেশাল কফি রিলিজ, ব্রিউইং গাইড এবং প্রথম টেবিল বুকিংয়ে বিশেষ সুবিধার জন্য সাবস্ক্রাইব করুন।',
    'newsletter.placeholder': 'আপনার ইমেইল এড্রেস দিন...',
    'newsletter.btn': 'যুক্ত হোন',

    // Footer
    'footer.brand_desc': 'প্রিমিয়াম স্পেশালিটি কফি ও আর্টিসান মাইক্রো-রোস্টারি। সর্বোচ্চ মানের অ্যারাবিকা বিন ও মন জুড়ানো লাউঞ্জ পরিবেশ।',
    'footer.col_direct': 'সরাসরি যোগাযোগ',
    'footer.col_pages': 'পলিসি ও তথ্য',
    'footer.coffee_menu': 'কফি মেনু',
    'footer.style_guide': 'স্টাইল গাইড',
    'footer.privacy': 'প্রাইভেসি পলিসি',
    'footer.terms': 'শর্তাবলী ও নিয়ম',
    'footer.delivery': 'বুকিং ও রিটার্ন পলিসি',
    'footer.rights': '© ২০২৬ কফিকো রোস্টারি ইনক. সর্বস্বত্ব সংরক্ষিত।',
    'footer.design_system': 'ডিজাইন সিস্টেম',

    // Booking Modal
    'booking.modal_badge': '☕ টেবিল ও কফি লাউঞ্জ রিজার্ভেশন',
    'booking.modal_title': 'আপনার অভিজ্ঞতা বুক করুন',
    'booking.modal_desc': 'হোম ডেলিভারি নয় — ক্যাফে লাউঞ্জে সরাসরি আগমন ও স্পেশাল কফি সেশনের জন্য অগ্রিম আসন নিশ্চিত করুন।',
    'booking.lbl_date': '📅 আগমনের তারিখ',
    'booking.lbl_time': '⏰ আগমনের সময় (স্লট)',
    'booking.lbl_guests': '👥 কতজন আসবেন (গেস্ট)',
    'booking.lbl_zone': '🛋️ আসন এরিয়া পছন্দ',
    'booking.lbl_name': '👤 আপনার পুরো নাম',
    'booking.lbl_phone': '📱 মোবাইল / হোয়াটসঅ্যাপ নম্বর',
    'booking.lbl_notes': '📝 বিশেষ কোনো অনুরোধ (ঐচ্ছিক)',
    'booking.btn_submit': '✨ বুকিং নিশ্চিত করুন',
    'booking.footer_note': '🔒 কোনো অগ্রিম ফি নেই। আপনার বুকিং কনফার্মেশন সাথে সাথে হোয়াটসঅ্যাপে পাঠানো হবে।',
    'booking.success_title': 'টেবিল বুকিং সম্পন্ন হয়েছে!',
    'booking.success_desc': 'আপনার আসন ও কফি সেশন সংরক্ষণ করা হয়েছে। আপনার রেফারেন্স নিচে দেওয়া হলো:',
    'booking.btn_whatsapp': '💬 হোয়াটসঅ্যাপে তাৎক্ষণিক কনফার্মেশন পাঠান',
    'booking.btn_done': 'সম্পন্ন (Done)'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('coffiko_lang') || 'bn';
    window.currentLang = this.currentLang;
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.bindSwitcher();
  }

  get(key) {
    return COFFIKO_TRANSLATIONS[this.currentLang]?.[key] || COFFIKO_TRANSLATIONS['en']?.[key] || key;
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'bn') return;
    this.currentLang = lang;
    window.currentLang = lang;
    localStorage.setItem('coffiko_lang', lang);
    this.applyLanguage(lang);
    this.updateSwitcherButtons();
    window.dispatchEvent(new CustomEvent('coffiko:lang-changed', { detail: { lang } }));
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    const dict = COFFIKO_TRANSLATIONS[lang] || COFFIKO_TRANSLATIONS['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    this.updateTimeSlots(lang);
    this.updateGuestOptions(lang);
    this.updateZoneOptions(lang);
  }

  updateTimeSlots(lang) {
    const select = document.getElementById('bookingTimeSelect');
    if (!select) return;
    const isBn = lang === 'bn';
    const slots = [
      { val: '10:00 AM - 11:30 AM', en: '10:00 AM - 11:30 AM (Morning Brew)', bn: '১০:০০ AM - ১১:৩০ AM (সকাল)' },
      { val: '12:00 PM - 01:30 PM', en: '12:00 PM - 01:30 PM (Midday Refresh)', bn: '১২:০০ PM - ০১:৩০ PM (দুপুর)' },
      { val: '03:30 PM - 05:00 PM', en: '03:30 PM - 05:00 PM (Afternoon Coffee)', bn: '০৩:৩০ PM - ০৫:০০ PM (বিকাল)' },
      { val: '05:30 PM - 07:00 PM', en: '05:30 PM - 07:00 PM (Sunset Lounge)', bn: '০৫:৩০ PM - ০৭:০০ PM (সন্ধ্যা)' },
      { val: '07:30 PM - 09:00 PM', en: '07:30 PM - 09:00 PM (Evening Vibes)', bn: '০৭:৩০ PM - ০৯:০০ PM (রাত)' },
      { val: '09:00 PM - 10:30 PM', en: '09:00 PM - 10:30 PM (Night Roast Session)', bn: '০৯:০০ PM - ১০:৩০ PM (লেট নাইট)' }
    ];
    const curVal = select.value;
    select.innerHTML = slots.map(s => `
      <option value="${s.val}" ${curVal.includes(s.val) ? 'selected' : (s.val === '05:30 PM - 07:00 PM' ? 'selected' : '')}>
        ${isBn ? s.bn : s.en}
      </option>
    `).join('');
  }

  updateGuestOptions(lang) {
    const select = document.getElementById('bookingGuestsSelect');
    if (!select) return;
    const isBn = lang === 'bn';
    const guests = [
      { val: '1 Person', en: '1 Person (Solo Chill / Work)', bn: '১ জন (সোলো ওয়ার্ক / রিডিং)' },
      { val: '2 Persons', en: '2 Persons (Duo / Couple Table)', bn: '২ জন (কাপল / ডুও টেবিল)' },
      { val: '3 - 4 Persons', en: '3 - 4 Persons (Small Group / Friends)', bn: '৩ - ৪ জন (ফ্রেন্ডস ও ফ্যামিলি)' },
      { val: '5 - 8 Persons', en: '5 - 8 Persons (Lounge Meeting & Chat)', bn: '৫ - ৮ জন (লাউঞ্জ মিটিং ও আড্ডা)' },
      { val: '8+ Persons', en: '8+ Persons (VIP Executive Suite)', bn: '৮+ জন (ভিআইপি গ্রুপ লাউঞ্জ)' }
    ];
    const curVal = select.value;
    select.innerHTML = guests.map(g => `
      <option value="${g.val}" ${curVal.includes(g.val) ? 'selected' : (g.val === '2 Persons' ? 'selected' : '')}>
        ${isBn ? g.bn : g.en}
      </option>
    `).join('');
  }

  updateZoneOptions(lang) {
    const select = document.getElementById('bookingZoneSelect');
    if (!select) return;
    const isBn = lang === 'bn';
    const zones = [
      { val: 'Main AC Lounge', en: '🛋️ Main AC Lounge', bn: '🛋️ মেইন এসি লাউঞ্জ' },
      { val: 'Terrace Garden', en: '🌿 Rooftop Terrace Garden', bn: '🌿 রুফটপ ওপেন-এয়ার টেরেস' },
      { val: 'Quiet Work Corner', en: '💻 Quiet Work Corner', bn: '💻 সাইলেন্ট কোয়াইট কর্নার' }
    ];
    const curVal = select.value;
    select.innerHTML = zones.map(z => `
      <option value="${z.val}" ${curVal.includes(z.val) ? 'selected' : (z.val === 'Main AC Lounge' ? 'selected' : '')}>
        ${isBn ? z.bn : z.en}
      </option>
    `).join('');
  }

  bindSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang');
        this.setLanguage(targetLang);
      });
    });
    this.updateSwitcherButtons();
  }

  updateSwitcherButtons() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
      const bLang = btn.getAttribute('data-lang');
      if (bLang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

window.coffikoI18n = new I18nManager();
