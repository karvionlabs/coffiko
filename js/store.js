/**
 * BREWLAB REACTIVE STORE & LOCAL CMS ENGINE
 * Handles mock database persistence with LocalStorage, reactive updates & seeds.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'coffiko_products_bdt_v2',
  ORDERS: 'coffiko_orders_bdt_v2',
  LEADS: 'coffiko_leads_bdt_v2',
  SETTINGS: 'coffiko_settings_bdt_v2'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Iced Hazelnut Latte',
    category: 'cold-brew',
    price: 380,
    badge: 'Popular',
    notes: 'প্রিমিয়াম হ্যাজেলনাট সিরাপ, ডাবল রিস্ট্রেত্তো এস্প্রেসো এবং হিমশীতল ফ্রেশ মিল্ক।',
    image: 'assets/images/product-roast-1.avif',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Cold Brew Delight',
    category: 'cold-brew',
    price: 350,
    badge: 'Best Seller',
    notes: '২৪ ঘণ্টার স্লো-ড্রিপ ইথিওপিয়ান সিঙ্গেল-অরিজিন ডার্ক রোস্টেড কোল্ড কফি।',
    image: 'assets/images/product-roast-2.avif',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Mocha Fusion Roast',
    category: 'dark-roast',
    price: 440,
    badge: 'Signature',
    notes: 'ভ্যালভেটি ডার্ক চকলেট ও তাজা কলম্বিয়ান কফি বিনের ব্লেন্ডেড স্বাদে ভরপুর।',
    image: 'assets/images/product-roast-3.avif',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Single Origin Organic Beans',
    category: 'organic',
    price: 1150,
    badge: 'Artisan',
    notes: '২৫০ গ্রাম প্রিমিয়াম অ্যারাবিকা হোল কফি বিন্স, হোম ব্রিউইং-এর জন্য সেরা পছন্দ।',
    image: 'assets/images/about-coffee-craft.avif',
    inStock: true
  }
];

const DEFAULT_SETTINGS = {
  shopName: 'Coffiko Cafe & Roastery',
  tagline: "Premier artisan coffee & specialty roastery",
  announcement: '☕ Fresh small-batch roast every Tuesday & Friday!',
  contactEmail: 'hellokarvionlabs@gmail.com',
  whatsapp: '+8801884636312',
  linkedin: 'https://linkedin.com/in/abdullah-karif-shahjada-'
};

class BrewlabStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([
        {
          id: 'BK-1082',
          customerName: 'Shakil Ahmed',
          phone: '+8801884636312',
          item: 'Iced Hazelnut Latte x 2',
          guests: '২ জন (Couple Table)',
          date: '2026-11-04',
          timeSlot: '০৫:৩০ PM - ০৭:০০ PM (সন্ধ্যা)',
          zone: '🛋️ মেইন এসি লাউঞ্জ',
          notes: 'উইন্ডো সাইড টেবিল পছন্দ',
          total: 760,
          status: 'Confirmed',
          type: 'Reservation',
          time: new Date(Date.now() - 1000 * 60 * 25).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'BK-1083',
          customerName: 'Md mahamud',
          phone: '+8801712345678',
          item: 'Cold Brew Delight x 1',
          guests: '১ জন (Solo Chill)',
          date: '2026-11-04',
          timeSlot: '০৩:৩০ PM - ০৫:০০ PM (বিকাল)',
          zone: '💻 সাইলেন্ট কোয়াইট কর্নার',
          notes: 'ল্যাপটপে কাজের জন্য প্লাগ পয়েন্ট প্রয়োজন',
          total: 350,
          status: 'Pending',
          type: 'Reservation',
          time: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'BK-1084',
          customerName: 'Md Emran',
          phone: '+8801912987654',
          item: 'Mocha Fusion Roast & Tasting Session',
          guests: '৪ জন (Friends & Family)',
          date: '2026-11-04',
          timeSlot: '০৭:৩০ PM - ০৯:০০ PM (রাত)',
          zone: '🌿 রুফটপ ওপেন-এয়ার টেরেস',
          notes: 'ফ্রেন্ডস গ্যাদারিং ও কফি আড্ডা',
          total: 880,
          status: 'Confirmed',
          type: 'Reservation',
          time: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify([
        { email: 'coffeelover99@gmail.com', date: '2026-11-03' },
        { email: 'alexander@designer.io', date: '2026-11-04' }
      ]));
    }
  }

  // --- Products CRUD ---
  getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  }

  saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      product.id = 'prod-' + Date.now();
      products.push(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('brewlab:products-updated', { detail: products }));
    return product;
  }

  deleteProduct(productId) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('brewlab:products-updated', { detail: products }));
  }

  // --- Orders & Table Reservations Management ---
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  }

  createBooking(bookingData) {
    const orders = this.getOrders();
    const newBooking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed',
      type: 'Reservation',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    orders.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('brewlab:order-created', { detail: newBooking }));
    return newBooking;
  }

  createOrder(orderData) {
    return this.createBooking(orderData);
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('brewlab:orders-updated', { detail: orders }));
    }
  }

  // --- Leads / Newsletter ---
  getLeads() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
  }

  addLead(email) {
    const leads = this.getLeads();
    if (!leads.some(l => l.email === email)) {
      leads.unshift({ email, date: new Date().toISOString().split('T')[0] });
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('brewlab:leads-updated', { detail: leads }));
    }
  }

  // --- Settings ---
  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
  }

  saveSettings(newSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    window.dispatchEvent(new CustomEvent('brewlab:settings-updated', { detail: newSettings }));
  }
}

// Global store instance
window.brewlabStore = new BrewlabStore();
