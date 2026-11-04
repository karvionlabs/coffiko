/**
 * BREWLAB REACTIVE STORE & LOCAL CMS ENGINE
 * Handles mock database persistence with LocalStorage, reactive updates & seeds.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'brewlab_products_v1',
  ORDERS: 'brewlab_orders_v1',
  LEADS: 'brewlab_leads_v1',
  SETTINGS: 'brewlab_settings_v1'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Iced Hazelnut Latte',
    category: 'cold-brew',
    price: 6.50,
    badge: 'Popular',
    notes: 'Artisanal hazelnut syrup, double ristretto, organic oat milk over hand-cut ice.',
    image: 'assets/images/product-roast-1.avif',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Cold Brew Delight',
    category: 'cold-brew',
    price: 5.75,
    badge: 'Best Seller',
    notes: '24-hour slow steep Ethiopian single-origin with bright floral and citrus notes.',
    image: 'assets/images/product-roast-2.avif',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Mocha Fusion Roast',
    category: 'dark-roast',
    price: 7.20,
    badge: 'Signature',
    notes: 'Velvety dark chocolate ganache blended with dark roasted Colombian espresso.',
    image: 'assets/images/product-roast-3.avif',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Single Origin Organic Beans',
    category: 'organic',
    price: 18.00,
    badge: 'Artisan',
    notes: '340g whole beans roasted in small batches in Cleveland roastery.',
    image: 'assets/images/about-coffee-craft.avif',
    inStock: true
  }
];

const DEFAULT_SETTINGS = {
  shopName: 'Coffiko Cafe & Roastery',
  tagline: "Cleveland's premier artisan coffee lab",
  announcement: '☕ Fresh small-batch roast every Tuesday & Friday!',
  contactEmail: 'hello@orbix.studio'
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
          id: 'ORD-1092',
          customerName: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          item: 'Iced Hazelnut Latte x 2',
          total: 13.00,
          status: 'Ready',
          time: new Date(Date.now() - 1000 * 60 * 25).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'ORD-1093',
          customerName: 'Marcus Vance',
          email: 'marcus@example.com',
          item: 'Cold Brew Delight x 1',
          total: 5.75,
          status: 'Brewing',
          time: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  // --- Orders Management ---
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Brewing',
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('brewlab:order-created', { detail: newOrder }));
    return newOrder;
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
