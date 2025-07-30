function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", product.id);
    card.innerHTML = `
        <div class="product-image-wrapper">
          <img
            class="product-image"
            src="${product.image.desktop}"
            alt="${product.name}"
          />
          <div class="add-btn" data-state="initial">
            <button class="add-to-cart">
              <img src="assets/images/icon-add-to-cart.svg" alt="Cart" />
              <p>Add to Cart</p>
            </button>
            <div class="quantity-controls">
              <button class="decrease">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="currentColor" viewBox="0 0 10 2">
                  <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
                </svg>
              </button>
              <span class="quantity">1</span>
              <button class="increase">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 10 10">
                  <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="product-card-text">
          <p class="product-category">${product.category}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
      `;

    const btn = card.querySelector(".add-btn");
    const addToCart = btn.querySelector(".add-to-cart");
    const qtyDisplay = btn.querySelector(".quantity");
    const decrease = btn.querySelector(".decrease");
    const increase = btn.querySelector(".increase");

    addToCart.addEventListener("click", () => {
        btn.dataset.state = "quantity";
        qtyDisplay.textContent = 1;

        cartItems[product.id] = {
            ...product,
            quantity: 1,
        };
        updateCartUI();
    });

    increase.addEventListener("click", () => {
        const newQty = parseInt(qtyDisplay.textContent) + 1;
        qtyDisplay.textContent = newQty;

        if (cartItems[product.id]) {
            cartItems[product.id].quantity = newQty;
        }
        updateCartUI();
    });

    decrease.addEventListener("click", () => {
        let qty = parseInt(qtyDisplay.textContent);
        if (qty > 1) {
            qty -= 1;
            qtyDisplay.textContent = qty;
            cartItems[product.id].quantity = qty;
        } else {
            btn.dataset.state = "default";
            delete cartItems[product.id];
        }
        updateCartUI();
    });

    return card;
}

async function loadProducts() {
    const response = await fetch("data.json");
    const products = await response.json();

    const grid = document.getElementById("productsGrid");
    grid.innerHTML = "";

    products.forEach((product) => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

window.addEventListener("DOMContentLoaded", loadProducts);

const cart = document.querySelector(".cart");
const cartProductsContainer = document.getElementById("cartProducts");
const cartQuantity = document.querySelector(".cart-quantity");
const cartTotal = document.querySelector(".cart-total-price");

let cartItems = {};

function updateCartUI() {
    cartProductsContainer.innerHTML = "";

    const items = Object.values(cartItems);
    if (items.length === 0) {
        cart.dataset.state = "empty";
        cartQuantity.textContent = 0;
        cartTotal.textContent = "$0.00";
        return;
    }

    cart.dataset.state = "full";

    let totalQty = 0;
    let totalPrice = 0;

    items.forEach((item) => {
        const { id, name, price, quantity } = item;

        const entry = document.createElement("div");
        entry.className = "cart-entry";

        entry.innerHTML = `
            <div class="cart-entry-content">
                <p class="cart-entry-name">${name}</p>
                <div class="cart-entry-details">
                    <span class="product-amount">${quantity}x</span>
                    <span class="product-unit-price">@$${price.toFixed(2)}</span>
                    <span class="product-total-price">$${(price * quantity).toFixed(
                        2
                    )}</span>
                </div>
            </div>
            <button class="remove-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 10 10">
                    <path d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                </svg>
            </button>
        `;

        // Remove handler
        entry.querySelector(".remove-btn").addEventListener("click", () => {
            delete cartItems[id];
            updateCartUI();
            const card = document.querySelector(`.product-card[data-id="${id}"]`);
            if (card) {
                const btn = card.querySelector(".add-btn");
                const qtyDisplay = btn.querySelector(".quantity");
                btn.dataset.state = "default";
                qtyDisplay.textContent = 1;
            }
        });

        cartProductsContainer.appendChild(entry);

        totalQty += quantity;
        totalPrice += price * quantity;
    });

    cartQuantity.textContent = totalQty;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}
