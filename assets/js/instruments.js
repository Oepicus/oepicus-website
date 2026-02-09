document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-display-container');
    // Only run this script on the instruments page where the container exists.
    if (!container) return;

    // Read data from the global variable set in default.html
    const products = window.PRODUCT_DATA || [];
    let currentImageIndex = 0;
    let currentProduct = null;

    function generateProductHTML(product) {
        currentProduct = product;
        currentImageIndex = 0;

        const imagesHTML = product.images.map((img, index) => {
            const imgPath = img.replace('//', '/');
            return `<img src="${imgPath}.png" alt="${product.name} view ${index + 1}" class="carousel-image w-full h-full object-contain drop-shadow-xl ${index === 0 ? 'active' : ''}">`;
        }).join('');

        const dotsHTML = product.images.length > 1 ? product.images.map((_, index) => {
            return `<button class="carousel-dot w-2 h-2 rounded-full ${index === 0 ? 'bg-brand-gold' : 'bg-white/30'}" onclick="setCarouselImage(${index})"></button>`;
        }).join('') : '';

        const featuresHTML = product.features.map(feature => {
            return `<li class="flex items-start gap-3"><div class="w-1.5 h-1.5 mt-2 bg-brand-gold rounded-full shrink-0"></div><span>${feature}</span></li>`;
        }).join('');

        return `
            <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
                <!-- Left Side: Image Carousel -->
                <div class="relative aspect-square flex items-center justify-center bg-white/5 rounded-lg p-8">
                    <div class="product-image-carousel w-full h-full">
                        ${imagesHTML}
                    </div>
                    ${product.images.length > 1 ? `
                    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        ${dotsHTML}
                    </div>
                    <button class="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:text-brand-gold" onclick="changeCarouselImage(-1)">
                        <svg class="w-6 h-6"><use xlink:href="#lucide-chevron-left"></use></svg>
                    </button>
                    <button class="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:text-brand-gold" onclick="changeCarouselImage(1)">
                        <svg class="w-6 h-6"><use xlink:href="#lucide-chevron-right"></use></svg>
                    </button>
                    ` : ''}
                </div>

                <!-- Right Side: Details -->
                <div class="text-white">
                    <p class="text-brand-gold font-bold uppercase tracking-widest text-xs mb-2">${product.category}</p>
                    <h1 class="text-4xl md:text-5xl font-display font-bold mb-2">${product.name}</h1>
                    <h2 class="text-xl text-text-muted font-light mb-6">${product.subtitle}</h2>
                    
                    <div class="prose prose-invert prose-lg max-w-none text-text-muted leading-relaxed mb-8">
                        <p>${product.desc.replace(/\n\n/g, '</p><p>')}</p>
                    </div>

                    <div class="mb-8">
                        <h3 class="font-bold text-white uppercase tracking-widest text-sm mb-4">Core Character</h3>
                        <ul class="space-y-3 text-text-muted">
                            ${featuresHTML}
                        </ul>
                    </div>

                    <div class="grid grid-cols-2 gap-4 bg-black/40 p-6 rounded-lg border border-white/10">
                        <div>
                            <p class="text-xs text-text-muted uppercase tracking-widest">Bypass</p>
                            <p class="font-bold text-white">${product.specs.bypass}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-muted uppercase tracking-widest">Power</p>
                            <p class="font-bold text-white">${product.specs.power}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-muted uppercase tracking-widest">Draw</p>
                            <p class="font-bold text-white">${product.specs.draw}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-muted uppercase tracking-widest">Origin</p>
                            <p class="font-bold text-white">${product.specs.origin}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateProductDisplay(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        container.style.opacity = 0;

        setTimeout(() => {
            container.innerHTML = generateProductHTML(product);
            container.style.opacity = 1;
            window.history.replaceState(null, '', `#${productId}`);
        }, 300); // Match transition duration
    }

    window.selectProduct = function(productId, event) {
        if (event) event.preventDefault();

        // Update active state in nav
        document.querySelectorAll('.product-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.productId === productId) {
                item.classList.add('active');
            }
        });

        updateProductDisplay(productId);
    }

    window.updateCarouselUI = function() {
        const images = document.querySelectorAll('.product-image-carousel .carousel-image');
        const dots = document.querySelectorAll('.product-image-carousel .carousel-dot');

        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentImageIndex);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('bg-brand-gold', index === currentImageIndex);
            dot.classList.toggle('bg-white/30', index !== currentImageIndex);
        });
    }

    window.setCarouselImage = function(index) {
        currentImageIndex = index;
        updateCarouselUI();
    }

    window.changeCarouselImage = function(direction) {
        if (!currentProduct) return;
        const newIndex = currentImageIndex + direction;
        const numImages = currentProduct.images.length;

        if (newIndex >= numImages) {
            currentImageIndex = 0;
        } else if (newIndex < 0) {
            currentImageIndex = numImages - 1;
        } else {
            currentImageIndex = newIndex;
        }
        updateCarouselUI();
    }

    // Initial setup
    const initialProductId = window.location.hash.substring(1);
    const productExists = products.some(p => p.id === initialProductId);

    if (initialProductId && productExists) {
        selectProduct(initialProductId);
    } else {
        // Select the first product by default
        if (products.length > 0) {
            selectProduct(products[0].id);
        }
    }
});