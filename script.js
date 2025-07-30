document.querySelectorAll(".add-btn").forEach((btn) => {
    const addToCart = btn.querySelector(".add-to-cart");
    const qtyDisplay = btn.querySelector(".quantity");
    const decrease = btn.querySelector(".decrease");
    const increase = btn.querySelector(".increase");

    addToCart.addEventListener("click", () => {
        btn.dataset.state = "quantity";
        qtyDisplay.textContent = 1;
    });

    increase.addEventListener("click", () => {
        qtyDisplay.textContent = parseInt(qtyDisplay.textContent) + 1;
    });

    decrease.addEventListener("click", () => {
        let qty = parseInt(qtyDisplay.textContent);
        if (qty > 1) {
            qtyDisplay.textContent = qty - 1;
        } else {
            btn.dataset.state = "default"; // Switch back to default button
        }
    });
});
