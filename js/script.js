document.addEventListener('DOMContentLoaded', () => {
  const cart = [];
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalContainer = document.getElementById('cart-total');
  const confirmOrderBtn = document.getElementById('confirm-order');
  const notification = document.getElementById('notification');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartIcon = document.getElementById('cart-icon');
  const cartCount = document.getElementById('cart-count');

  // Sepet ikonuna tıklayınca menüyü aç/kapa
  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('show');
  });

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    notification.classList.remove('hidden');
    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hidden');
    }, 2000);
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Sepetiniz boş.</p>';
      cartTotalContainer.textContent = 'Toplam: 0₺';
      confirmOrderBtn.disabled = true;
      cartCount.textContent = '0';
      return;
    }

    let total = 0;
    cart.forEach((item, index) => {
      const p = document.createElement('p');
      p.style.display = 'flex';
      p.style.justifyContent = 'space-between';
      p.style.alignItems = 'center';
      p.style.margin = '8px 0';

      const spanText = document.createElement('span');
      spanText.textContent = `${index + 1}. ${item.name} - ${item.price}₺`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Sil';
      removeBtn.style.backgroundColor = '#e74c3c';
      removeBtn.style.color = 'white';
      removeBtn.style.border = 'none';
      removeBtn.style.borderRadius = '4px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.padding = '2px 6px';
      removeBtn.addEventListener('click', () => {
        removeFromCart(index);
      });

      p.appendChild(spanText);
      p.appendChild(removeBtn);
      cartItemsContainer.appendChild(p);

      total += Number(item.price);
    });

    cartTotalContainer.textContent = `Toplam: ${total}₺`;
    confirmOrderBtn.disabled = false;

    cartCount.textContent = cart.length.toString();
  }

  function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    updateCartUI();
    showNotification(`${productName} sepete eklendi!`);
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    showNotification('Ürün sepetten silindi.');
  }

  function sendOrderToWhatsApp() {
    if (cart.length === 0) {
      alert('Lütfen önce sepete ürün ekleyin.');
      return;
    }
    const messageLines = cart.map((item, i) => `${i + 1}. ${item.name} - ${item.price}₺`);
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    const message = `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n${messageLines.join('\n')}\nToplam: ${total}₺`;
    const encodedMessage = encodeURIComponent(message);

    const phoneNumber = '905305858228'; // Kendi numaranıza göre değiştirin
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const product = button.closest('.product');
      const name = product.getAttribute('data-name');
      const price = product.getAttribute('data-price');
      addToCart(name, price);
    });
  });

  confirmOrderBtn.addEventListener('click', sendOrderToWhatsApp);

  // Başlangıçta menü kapalı
  cartSidebar.classList.remove('show');

  updateCartUI();
});
