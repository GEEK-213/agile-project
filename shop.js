// Cart functionality
document.addEventListener('DOMContentLoaded', function () {
    // Cart variables
    let cartItems = [];
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.querySelector('.total-price');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    // Open cart modal
    cartBtn.addEventListener('click', function () {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });

    // Close cart modal
    closeCart.addEventListener('click', function () {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling again
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const product = this.closest('.product1');
            const productImage = product.querySelector('.product-image img').src;
            const productName = product.querySelector('.product-name').textContent;
            const productPrice = product.querySelector('.product-price').textContent;
            const price = parseFloat(productPrice.replace('$', ''));

            // Check if item already in cart
            const existingItemIndex = cartItems.findIndex(item => item.name === productName);

            if (existingItemIndex > -1) {
                // Item exists, increase quantity
                cartItems[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cartItems.push({
                    image: productImage,
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            // Add animation to button
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);

            updateCart();
        });
    });

    // Update cart display
    function updateCart() {
        // Update cart count
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items display
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            totalPrice.textContent = '$0.00';
            return;
        }

        let cartHTML = '';
        let cartTotal = 0;

        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;

            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-index="${index}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-index="${index}">+</button>
                            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = cartHTML;
        totalPrice.textContent = `$${cartTotal.toFixed(2)}`;

        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity -= 1;
                } else {
                    cartItems.splice(index, 1);
                }
                updateCart();
            });
        });

        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cartItems[index].quantity += 1;
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cartItems.splice(index, 1);
                updateCart();
            });
        });
    }

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function () {
        if (cartItems.length > 0) {
            alert('Thank you for your purchase! Your order has been placed.');
            cartItems = [];
            updateCart();
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            alert('Your cart is empty. Please add items before checking out.');
        }
    });
});

// Filter functionality
document.addEventListener('DOMContentLoaded', function () {
    // Filter variables
    const filterBtn = document.getElementById('filter');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterClose = document.querySelector('.filter-close');
    const filterClear = document.querySelector('.filter-clear');
    const filterApply = document.querySelector('.filter-apply');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

    // Toggle filter dropdown
    filterBtn.addEventListener('click', function (e) {
        filterDropdown.classList.toggle('active');
    });

    // Close filter dropdown when clicking close button
    filterClose.addEventListener('click', function () {
        filterDropdown.classList.remove('active');
    });

    // Close filter dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
            filterDropdown.classList.remove('active');
        }
    });

    // Clear all filters
    filterClear.addEventListener('click', function () {
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });

    // Apply filters
    filterApply.addEventListener('click', function () {
        const selectedCategories = [];
        const selectedPrices = [];

        // Get selected categories
        document.querySelectorAll('.filter-checkbox[data-category]:checked').forEach(checkbox => {
            const category = checkbox.getAttribute('data-category');
            if (category === 'Gear') {
                selectedCategories.push('Mouse', 'Keyboard', 'HeadPhones');
            } else if (category === 'Accessory') {
                selectedCategories.push('Gaming Chair', 'Accessory');
            } else {
                selectedCategories.push(category);
            }
        });

        // Get selected price ranges
        document.querySelectorAll('.filter-checkbox[data-price]:checked').forEach(checkbox => {
            selectedPrices.push(checkbox.getAttribute('data-price'));
        });

        // Filter products
        const products = document.querySelectorAll('.product1');
        products.forEach(product => {
            const category = product.querySelector('.product-category').textContent;
            const price = parseFloat(product.querySelector('.product-price').textContent.replace('$', ''));

            // Category matching (including subcategories)
            let categoryMatch = selectedCategories.length === 0 ||
                selectedCategories.some(selectedCat => {
                    const productCategory = category.trim().toLowerCase();
                    const selectedCategory = selectedCat.toLowerCase();

                    // Direct category match
                    if (productCategory === selectedCategory) return true;

                    // Check for gear subcategories
                    if (selectedCategory === 'gear' &&
                        ['mouse', 'keyboard', 'headphones'].includes(productCategory)) {
                        return true;
                    }

                    // Check for accessory subcategories
                    if (selectedCategory === 'accessory' &&
                        ['gaming chair', 'accessory'].includes(productCategory)) {
                        return true;
                    }

                    return false;
                });

            // Price range matching
            let priceMatch = selectedPrices.length === 0 ||
                selectedPrices.some(range => {
                    const productPrice = price;
                    switch (range) {
                        case 'under50':
                            return productPrice < 200;
                        case '50to100':
                            return productPrice >= 200 && productPrice < 300;
                        case '100to200':
                            return productPrice >= 300;
                        case 'over200':
                            return productPrice > 200;
                        default:
                            return false;
                    }
                });

            // Show/hide products based on filters
            product.style.display = categoryMatch && priceMatch ? 'flex' : 'none';
        });

        // Close filter dropdown after applying
        filterDropdown.classList.remove('active');
    });
});