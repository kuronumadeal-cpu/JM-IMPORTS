const PRODUCTS = {
  preta: { id: 'preta', name: 'Camiseta Dry Fit Preta', price: 58.9 },
  branca: { id: 'branca', name: 'Camiseta Dry Fit Branca', price: 58.9 },
  kit: { id: 'kit', name: 'Kit Dry Fit (Preta + Branca)', price: 99.9 }
};

const STORAGE_KEY = 'jm_imports_cart';

const brl = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

const addToCart = (productId, qty) => {
  const product = PRODUCTS[productId];
  if (!product || qty < 1) return;
  const cart = getCart();
  for (let i = 0; i < qty; i += 1) {
    cart.push({ ...product, addedAt: Date.now() + i });
  }
  saveCart(cart);
  renderCartCount();
};

const clearCart = () => {
  saveCart([]);
  renderCartCount();
};

const cartTotals = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12.9;
  return { subtotal, shipping, total: subtotal + shipping };
};

const renderCartCount = () => {
  const el = document.querySelector('[data-cart-count]');
  if (!el) return;
  el.textContent = `${getCart().length} item(ns)`;
};

const renderCartPanel = () => {
  const list = document.querySelector('[data-cart-list]');
  if (!list) return;

  const cart = getCart();
  const totals = cartTotals(cart);
  list.innerHTML = '';

  if (!cart.length) {
    list.innerHTML = '<li>Seu carrinho está vazio.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.name}</span><strong>${brl(item.price)}</strong>`;
      list.appendChild(li);
    });
  }

  const subtotalEl = document.querySelector('[data-subtotal]');
  const shippingEl = document.querySelector('[data-shipping]');
  const totalEl = document.querySelector('[data-total]');

  if (subtotalEl) subtotalEl.textContent = brl(totals.subtotal);
  if (shippingEl) shippingEl.textContent = brl(totals.shipping);
  if (totalEl) totalEl.textContent = brl(totals.total);
};

const bindProductButtons = () => {
  document.querySelectorAll('[data-add-product]').forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.getAttribute('data-add-product');
      const qtyInput = button.closest('.product-card')?.querySelector('[data-qty]');
      const qty = qtyInput ? Number(qtyInput.value) || 1 : 1;
      addToCart(product, qty);
      renderCartPanel();
    });
  });
};

const bindCartActions = () => {
  const clearBtn = document.querySelector('[data-clear-cart]');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearCart();
      renderCartPanel();
    });
  }
};

const bindFilters = () => {
  const filter = document.querySelector('[data-filter-color]');
  if (!filter) return;
  filter.addEventListener('change', () => {
    const value = filter.value;
    document.querySelectorAll('[data-color]').forEach((card) => {
      card.style.display = value === 'todos' || card.getAttribute('data-color') === value ? 'block' : 'none';
    });
  });
};

const bindFAQ = () => {
  document.querySelectorAll('.faq-item .faq-btn').forEach((button) => {
    button.addEventListener('click', () => {
      button.parentElement.classList.toggle('open');
    });
  });
};

const bindCheckout = () => {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cart = getCart();
    const feedback = document.querySelector('[data-checkout-feedback]');
    if (!cart.length) {
      feedback.className = 'alert warn';
      feedback.textContent = 'Seu carrinho está vazio. Adicione produtos antes de finalizar.';
      return;
    }

    const orderCode = `JM${Math.floor(Math.random() * 90000 + 10000)}`;
    feedback.className = 'alert success';
    feedback.textContent = `Pedido ${orderCode} confirmado com sucesso! Em breve você receberá o rastreio por e-mail/WhatsApp.`;
    form.reset();
    clearCart();
    renderCartPanel();
  });
};

const bindTracking = () => {
  const form = document.querySelector('[data-track-form]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = form.querySelector('input')?.value?.trim();
    const result = document.querySelector('[data-track-result]');
    if (!code) {
      result.textContent = 'Digite um código válido.';
      return;
    }
    result.textContent = `Pedido ${code.toUpperCase()} em separação no centro logístico de São Paulo.`;
  });
};

const bindContact = () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = document.querySelector('[data-contact-feedback]');
    ok.className = 'alert success';
    ok.textContent = 'Mensagem enviada! Nosso time responderá em até 1 dia útil.';
    form.reset();
  });
};

const init = () => {
  renderCartCount();
  renderCartPanel();
  bindProductButtons();
  bindCartActions();
  bindFilters();
  bindFAQ();
  bindCheckout();
  bindTracking();
  bindContact();
};

document.addEventListener('DOMContentLoaded', init);
