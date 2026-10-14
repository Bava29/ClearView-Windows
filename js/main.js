
/* ==========================================
   CLEARVIEW WINDOWS - HEADER INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    // Header elements
    const menuToggle = document.getElementById("cvMenuToggle");
    const mobilePanel = document.getElementById("cvMobilePanel");

    const submenuToggle = document.getElementById("cvSubmenuToggle");
    const homeSubmenu = document.getElementById("cvHomeSubmenu");

    const desktopTheme = document.getElementById("cvDesktopTheme");
    const mobileTheme = document.getElementById("cvMobileTheme");

    const desktopRTL = document.getElementById("cvDesktopRTL");
    const mobileRTL = document.getElementById("cvMobileRTL");

    const mobileBreakpoint = window.matchMedia("(max-width: 1024px)");

    // Mark the current page in both navigation layouts.
    const currentPath = window.location.pathname;
    const currentPage = decodeURIComponent(currentPath.split("/").pop() || "index.html").toLowerCase();
    const homePages = new Set(["", "index.html", "home-2.html"]);

    document.querySelectorAll(".cv-desktop-nav a[href], .cv-mobile-nav a[href]").forEach((link) => {
        const target = new URL(link.href, window.location.href);
        const targetPage = decodeURIComponent(target.pathname.split("/").pop() || "index.html").toLowerCase();
        const isHomeParent = link.matches(".cv-home-dropdown > .cv-nav-link, .cv-mobile-home-row > a");
        const isCurrent = isHomeParent ? homePages.has(currentPage) : targetPage === currentPage;

        link.classList.toggle("active", isCurrent);
        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // --------------------------------------
    // MENU OPEN / CLOSE
    // --------------------------------------

    function closeMobileMenu() {
        mobilePanel.classList.remove("is-open");
        menuToggle.classList.remove("is-active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function openMobileMenu() {
        mobilePanel.classList.add("is-open");
        menuToggle.classList.add("is-active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mobilePanel.classList.contains("is-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        if (
            !mobilePanel.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    // Close after selecting a navigation link
    mobilePanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    // Reset mobile menu when returning to desktop
    mobileBreakpoint.addEventListener("change", (event) => {
        if (!event.matches) {
            closeMobileMenu();
        }
    });

    // --------------------------------------
    // HOME SUBMENU
    // --------------------------------------

    submenuToggle.addEventListener("click", () => {
        const isOpen = homeSubmenu.classList.toggle("is-open");

        submenuToggle.classList.toggle("is-active", isOpen);
        submenuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // --------------------------------------
    // DARK MODE
    // --------------------------------------

    function updateThemeButtons(isDark) {
        [desktopTheme, mobileTheme].forEach((button) => {
            button.setAttribute("aria-pressed", String(isDark));
            button.setAttribute(
                "aria-label",
                isDark ? "Enable light mode" : "Enable dark mode"
            );

            const icon = button.querySelector("i");
            const label = button.querySelector("span");

            if (icon) {
                icon.className = isDark
                    ? "fa-solid fa-sun"
                    : "fa-solid fa-moon";
            }

            if (label) {
                label.textContent = isDark ? "Light Mode" : "Dark Mode";
            }
        });
    }

    function applyTheme(isDark) {
        root.classList.toggle("dark-mode", isDark);

        try {
            localStorage.setItem(
                "clearview-theme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            // Theme still works for the current page.
        }

        updateThemeButtons(isDark);
    }

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("clearview-theme");
    } catch (error) {
        savedTheme = null;
    }

    applyTheme(savedTheme === "dark");

    [desktopTheme, mobileTheme].forEach((button) => {
        button.addEventListener("click", () => {
            const isDark = root.classList.contains("dark-mode");
            applyTheme(!isDark);
        });
    });

    // --------------------------------------
    // RTL MODE
    // --------------------------------------

    function updateRTLButtons(isRTL) {
        [desktopRTL, mobileRTL].forEach((button) => {
            button.setAttribute("aria-pressed", String(isRTL));
            button.setAttribute(
                "aria-label",
                isRTL ? "Disable RTL mode" : "Enable RTL mode"
            );

            const label = button.querySelector("span");

            if (label) {
                label.textContent = isRTL ? "LTR Mode" : "RTL Mode";
            }
        });
    }

    function applyRTL(isRTL) {
        root.setAttribute("dir", isRTL ? "rtl" : "ltr");

        try {
            localStorage.setItem(
                "clearview-direction",
                isRTL ? "rtl" : "ltr"
            );
        } catch (error) {
            // RTL still works for the current page.
        }

        updateRTLButtons(isRTL);
    }

    let savedDirection = null;

    try {
        savedDirection = localStorage.getItem("clearview-direction");
    } catch (error) {
        savedDirection = null;
    }

    applyRTL(savedDirection === "rtl");

    [desktopRTL, mobileRTL].forEach((button) => {
        button.addEventListener("click", () => {
            const isRTL = root.getAttribute("dir") === "rtl";
            applyRTL(!isRTL);
        });
    });

});


/* ==========================================
   FOOTER - DYNAMIC COPYRIGHT YEAR
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const copyrightYear = document.getElementById("cvCopyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
});


/* =========================================
   CLEARVIEW WINDOWS - HERO SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const hero = document.querySelector(".cv-home-hero");

    if (!hero) return;

    const slides = Array.from(
        hero.querySelectorAll(".cv-hero-slide")
    );

    const dots = Array.from(
        hero.querySelectorAll(".cv-hero-pagination button")
    );

    const previousButton = hero.querySelector(".cv-hero-prev");
    const nextButton = hero.querySelector(".cv-hero-next");

    if (slides.length !== 3 || dots.length !== 3) return;

    let currentIndex = 0;
    let sliderInterval = null;

    const slideDuration = 5000;

    function showSlide(index) {

        currentIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === currentIndex);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === currentIndex);
            dot.setAttribute(
                "aria-pressed",
                i === currentIndex ? "true" : "false"
            );
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function previousSlide() {
        showSlide(currentIndex - 1);
    }

    function stopSlider() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    }

    function startSlider() {
        stopSlider();

        if (
            document.hidden ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        sliderInterval = setInterval(nextSlide, slideDuration);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            startSlider();
        });
    });

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            nextSlide();
            startSlider();
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", function () {
            previousSlide();
            startSlider();
        });
    }

    hero.addEventListener("mouseenter", stopSlider);
    hero.addEventListener("mouseleave", startSlider);

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    showSlide(0);
    startSlider();

});

/* ========================== PRODUCTS CATALOGUE FILTERING ========================== */
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("cvProductGrid");
    if (!grid) return;
    const types = ["Casement Windows", "Sliding Windows", "Double-Hung Windows", "Awning Windows", "Picture Windows", "Bay & Bow Windows"];
    const facets = {
        type: { title: "Window type", icon: "fa-window-maximize", options: types },
        material: { title: "Frame material", icon: "fa-layer-group", options: ["uPVC", "Aluminium", "Wood", "Fibreglass"] },
        glazing: { title: "Glazing type", icon: "fa-border-all", options: ["Single / Standard Glazing", "Double Glazing", "Triple Glazing"] },
        style: { title: "Window style", icon: "fa-compass-drafting", options: ["Modern", "Traditional", "Minimalist"] },
        features: { title: "Performance features", icon: "fa-bolt", options: ["Energy Efficient", "Noise Reduction", "Low Maintenance", "Weather Resistant"] },
        finish: { title: "Colour / finish", icon: "fa-palette", options: ["White", "Black", "Grey", "Wood Finish"] }
    };
    const materials = facets.material.options, glazings = facets.glazing.options, styles = facets.style.options, featureOptions = facets.features.options, finishes = facets.finish.options;
    const series = ["Aster", "Meridian", "Haven", "Sierra"];
    const typeSlugs = ["casement", "sliding", "double-hung", "awning", "picture", "bay-bow"];
    const products = types.flatMap((type, ti) => series.map((name, ni) => {
        const featureA = featureOptions[(ti + ni) % featureOptions.length], featureB = featureOptions[(ti + ni + 1) % featureOptions.length];
        const id = `${typeSlugs[ti]}-${String(ni + 1).padStart(2, "0")}`;
        return { id, type, name: `${name} ${type.replace(" Windows", "")}`, material: materials[(ti + ni) % 4], glazing: glazings[(ti + ni) % 3], style: styles[(ti * 2 + ni) % 3], features: [...new Set([featureA, featureB])], finish: finishes[(ti + ni * 2) % 4], price: 850 + ti * 410 + ni * 275, image: `images/product-${id}.jpg`, fallback: ["images/window-casement.jpg", "images/window-sliding.jpg", "images/window-double-hung.jpg", "images/home2-casement-window.jpg", "images/energy-efficient-windows.jpg", "images/home2-window-materials.jpg"][ti], description: `${type} with a refined profile, dependable operation, and options suited to everyday comfort.` };
    }));
    const chosen = Object.fromEntries(Object.keys(facets).map(key => [key, new Set()]));
    const filterRoot = document.getElementById("cvProductFilters");
    Object.entries(facets).forEach(([key, facet], index) => {
        const group = document.createElement("details"); group.className = "cv-products-facet"; group.open = index === 0;
        group.innerHTML = `<summary><i class="fa-solid ${facet.icon}"></i>${facet.title}</summary>${facet.options.map(value => `<label class="cv-products-option"><input type="checkbox" data-filter="${key}" value="${value}"><span>${value}</span><small data-facet-count="${key}" data-value="${value}"></small></label>`).join("")}`;
        filterRoot.append(group);
    });
    const count = document.getElementById("cvProductCount"), search = document.getElementById("cvProductSearch"), sort = document.getElementById("cvProductSort"), price = document.getElementById("cvPriceRange"), active = document.getElementById("cvActiveFilters"), empty = document.getElementById("cvProductsEmpty"), modal = document.getElementById("cvProductModal"), modalBody = document.getElementById("cvProductModalBody"), quick = document.getElementById("cvQuickFilters");
    const money = n => `$${n.toLocaleString("en-US")}`;
    document.getElementById("cvPriceMinLabel").textContent = money(500);
    const priceMaxLabel = document.getElementById("cvPriceMaxLabel");
    [types[0], types[1], types[2]].forEach(type => { const chip = document.createElement("button"); chip.type = "button"; chip.className = "cv-products-chip"; chip.textContent = type; chip.addEventListener("click", () => { chosen.type.has(type) ? chosen.type.delete(type) : chosen.type.add(type); sync(); render(); }); quick.append(chip); });
    function sync() {
        document.querySelectorAll("[data-filter]").forEach(input => { input.checked = chosen[input.dataset.filter].has(input.value); });
        quick.querySelectorAll("button").forEach(button => button.classList.toggle("is-active", chosen.type.has(button.textContent)));
    }
    function matching(ignoreKey) {
        const query = search.value.trim().toLowerCase(), cap = Number(price.value);
        return products.filter(product => {
            if (product.price > cap || (query && !`${product.name} ${product.type} ${product.material} ${product.glazing} ${product.style} ${product.finish} ${product.features.join(" ")}`.toLowerCase().includes(query))) return false;
            return Object.entries(chosen).every(([key, values]) => key === ignoreKey || !values.size || (key === "features" ? [...values].every(value => product.features.includes(value)) : values.has(product[key])));
        });
    }
    function renderCards(list) {
        grid.innerHTML = list.map(p => `<article class="cv-products-card"><div class="cv-products-image"><img src="${p.image}" data-fallback="${p.fallback}" alt="${p.name}" loading="lazy"></div><div class="cv-products-card-content"><span class="cv-products-category">${p.type}</span><h3>${p.name}</h3><p>${p.description}</p><div class="cv-products-specs"><span>${p.material}</span><span>${p.glazing}</span><span>${p.style}</span><span>${p.finish}</span>${p.features.map(f => `<span>${f}</span>`).join("")}</div><div class="cv-products-card-bottom"><strong>${money(p.price)} <small>sample</small></strong><button type="button" data-details="${p.id}">View details</button></div></div></article>`).join("");
        grid.querySelectorAll("img").forEach(img => img.addEventListener("error", () => { if (!img.dataset.fallbackUsed) { img.dataset.fallbackUsed = "true"; img.src = img.dataset.fallback; } }));
    }
    function render() {
        const results = matching().sort((a, b) => sort.value === "name" ? a.name.localeCompare(b.name) : sort.value === "low" ? a.price - b.price : sort.value === "high" ? b.price - a.price : a.id.localeCompare(b.id));
        count.textContent = `${results.length} ${results.length === 1 ? "product" : "products"}`;
        grid.hidden = results.length === 0; empty.hidden = results.length > 0; renderCards(results);
        priceMaxLabel.textContent = money(Number(price.value));
        document.querySelectorAll("[data-facet-count]").forEach(node => { const key = node.dataset.facetCount, value = node.dataset.value; node.textContent = matching(key).filter(p => key === "features" ? p.features.includes(value) : p[key] === value).length; });
        const chips = [];
        Object.entries(chosen).forEach(([key, values]) => values.forEach(value => chips.push({ key, value, label: value })));
        if (search.value.trim()) chips.push({ key: "search", label: `Search: ${search.value.trim()}` });
        if (Number(price.value) < 5000) chips.push({ key: "price", label: `Up to ${money(Number(price.value))}` });
        active.innerHTML = chips.map((chip, i) => `<button type="button" data-chip="${i}">${chip.label} ×</button>`).join("");
        active.querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => { const chip = chips[index]; if (chip.key === "search") search.value = ""; else if (chip.key === "price") price.value = "5000"; else chosen[chip.key].delete(chip.value); sync(); render(); }));
        sync();
    }
    function clearAll() { Object.values(chosen).forEach(values => values.clear()); search.value = ""; sort.value = "featured"; price.value = "5000"; sync(); render(); }
    function showDetails(p) { modalBody.innerHTML = `<div class="cv-products-detail"><img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallback}'" alt="${p.name}"><div><span class="cv-products-category">${p.type}</span><h2 id="cvModalTitle">${p.name}</h2><p>${p.description}</p><ul><li>Frame: ${p.material}</li><li>Glazing: ${p.glazing}</li><li>Style: ${p.style}</li><li>Features: ${p.features.join(", ")}</li><li>Colour / finish: ${p.finish}</li></ul><strong>Illustrative sample: ${money(p.price)}</strong><p>Final pricing depends on dimensions, configuration, and installation requirements.</p></div></div>`; modal.hidden = false; document.body.style.overflow = "hidden"; }
    document.querySelectorAll("[data-filter]").forEach(input => input.addEventListener("change", () => { input.checked ? chosen[input.dataset.filter].add(input.value) : chosen[input.dataset.filter].delete(input.value); render(); }));
    document.querySelectorAll("[data-clear]").forEach(button => button.addEventListener("click", clearAll));
    search.addEventListener("input", render); sort.addEventListener("change", render); price.addEventListener("input", render);
    document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => { grid.classList.toggle("cv-products-list-view", button.dataset.view === "list"); document.querySelectorAll("[data-view]").forEach(view => view.classList.toggle("is-active", view === button)); }));
    grid.addEventListener("click", event => { const button = event.target.closest("[data-details]"); if (button) showDetails(products.find(product => product.id === button.dataset.details)); });
    modal.addEventListener("click", event => { if (event.target.closest("[data-close]")) { modal.hidden = true; document.body.style.overflow = ""; } });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) { modal.hidden = true; document.body.style.overflow = ""; } });
    render();
});


/* =========================================
   SECTION 6 - TESTIMONIAL SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const reviewSection = document.querySelector(".cv-reviews-section");

    if (!reviewSection) return;

    const slides = Array.from(
        reviewSection.querySelectorAll(".cv-review-slide")
    );

    const dots = Array.from(
        reviewSection.querySelectorAll(".cv-reviews-pagination button")
    );

    const previousButton = reviewSection.querySelector(".cv-review-prev");
    const nextButton = reviewSection.querySelector(".cv-review-next");

    if (!slides.length || slides.length !== dots.length) return;

    let currentIndex = 0;
    let reviewTimer = null;

    function showReview(index) {

        currentIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            const isActive = i === currentIndex;

            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach(function (dot, i) {
            const isActive = i === currentIndex;

            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-pressed", String(isActive));
        });
    }

    function nextReview() {
        showReview(currentIndex + 1);
    }

    function previousReview() {
        showReview(currentIndex - 1);
    }

    function stopReviewTimer() {
        if (reviewTimer) {
            clearInterval(reviewTimer);
            reviewTimer = null;
        }
    }

    function startReviewTimer() {
        stopReviewTimer();

        if (
            document.hidden ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        reviewTimer = setInterval(nextReview, 6000);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showReview(index);
            startReviewTimer();
        });
    });

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            nextReview();
            startReviewTimer();
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", function () {
            previousReview();
            startReviewTimer();
        });
    }

    reviewSection.addEventListener("mouseenter", stopReviewTimer);
    reviewSection.addEventListener("mouseleave", startReviewTimer);

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopReviewTimer();
        } else {
            startReviewTimer();
        }
    });

    showReview(0);
    startReviewTimer();

});

/* =========================================
   SECTION 8 - FAQ ACCORDION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const faqSection = document.querySelector(".cv-faq-section");

    if (!faqSection) return;

    const faqItems = faqSection.querySelectorAll(".cv-faq-item");

    faqItems.forEach(function (item) {

        const question = item.querySelector(".cv-faq-question");
        const icon = question.querySelector("i");

        question.addEventListener("click", function () {

            const isCurrentlyOpen = item.classList.contains("active");

            // Close all FAQ items
            faqItems.forEach(function (faqItem) {

                faqItem.classList.remove("active");

                const faqButton = faqItem.querySelector(
                    ".cv-faq-question"
                );

                const faqIcon = faqButton.querySelector("i");

                faqButton.setAttribute("aria-expanded", "false");

                faqIcon.classList.remove("fa-minus");
                faqIcon.classList.add("fa-plus");

            });

            // Open the selected item
            if (!isCurrentlyOpen) {

                item.classList.add("active");

                question.setAttribute("aria-expanded", "true");

                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");

            }

        });

    });

});

/* ==========================
   ABOUT PAGE: STATS COUNTER
=========================== */

document.addEventListener("DOMContentLoaded", function () {
    const statsSection = document.querySelector(".cv-about-stats");

    if (!statsSection) return;

    const counters = statsSection.querySelectorAll("[data-count]");
    let hasAnimated = false;

    function animateCounter(counter) {
        const target = Number(counter.dataset.count);

        if (!Number.isFinite(target)) return;

        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out animation
            const easedProgress = 1 - Math.pow(1 - progress, 4);

            const currentValue = Math.floor(
                target * easedProgress
            );

            counter.textContent = currentValue.toLocaleString("en-US");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString("en-US");
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function startCounters() {
        if (hasAnimated) return;

        hasAnimated = true;

        counters.forEach(function (counter) {
            animateCounter(counter);
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        startCounters();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer.observe(statsSection);
    } else {
        startCounters();
    }
});

/* =========================================
   ENERGY SAVINGS ESTIMATOR
   Illustrative calculation only
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cvEnergySavingsForm");

    if (!form) return;

    const windowCount = document.getElementById("cvEnergyWindowCount");
    const homeType = document.getElementById("cvEnergyHomeType");
    const currentWindows = document.getElementById("cvEnergyCurrentWindows");
    const climate = document.getElementById("cvEnergyClimate");
    const monthlyBill = document.getElementById("cvEnergyMonthlyBill");

    const annualSavings = document.getElementById("cvEnergyAnnualSavings");
    const monthlySavings = document.getElementById("cvEnergyMonthlySavings");
    const savingsPercent = document.getElementById("cvEnergySavingsPercent");
    const savingsRange = document.getElementById("cvEnergySavingsRange");
    const resultMessage = document.getElementById("cvEnergyResultMessage");

    const formatCurrency = function (amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    /* Window count increment and decrement */
    document.querySelectorAll("[data-energy-step]").forEach(function (button) {
        button.addEventListener("click", function () {
            const step = Number(this.dataset.energyStep);
            const current = Number(windowCount.value) || 1;

            windowCount.value = Math.min(
                100,
                Math.max(1, current + step)
            );
        });
    });

    /* Illustrative savings calculation */
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const count = Math.min(100, Math.max(1, Number(windowCount.value)));
        const bill = Math.max(1, Number(monthlyBill.value));
        const homeFactor = Number(homeType.value);
        const windowFactor = Number(currentWindows.value);
        const climateFactor = Number(climate.value);

        /*
         * Demo model only:
         * Actual savings depend on the property, local energy prices,
         * existing windows, glazing, installation and weather.
         */
        const estimatedRate = Math.min(
            0.30,
            0.08 * windowFactor * climateFactor * homeFactor
        );

        const scaleFactor = Math.min(1.5, 0.65 + count * 0.035);
        const estimatedMonthly = bill * estimatedRate * scaleFactor;
        const estimatedAnnual = estimatedMonthly * 12;

        const lowerEstimate = estimatedAnnual * 0.7;
        const upperEstimate = estimatedAnnual * 1.3;

        annualSavings.textContent = formatCurrency(estimatedAnnual);
        monthlySavings.textContent = formatCurrency(estimatedMonthly);
        savingsPercent.textContent =
            Math.round(estimatedRate * scaleFactor * 100) + "%";

        savingsRange.textContent =
            formatCurrency(lowerEstimate) + " – " +
            formatCurrency(upperEstimate) + " per year";

        resultMessage.textContent =
            "Illustrative estimate based on your entries. Actual savings may be lower or higher; a home assessment and product specifications are needed for a reliable estimate.";
    });
});

/* =========================================
   SECTION 5: ENERGY SAVINGS FAQ ACCORDION
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const faqItems = document.querySelectorAll(
        ".cv-energy-faq-item"
    );

    faqItems.forEach(function (item) {
        const button = item.querySelector(
            ".cv-energy-faq-question"
        );

        const answer = item.querySelector(
            ".cv-energy-faq-answer"
        );

        if (!button || !answer) return;

        button.setAttribute(
            "aria-expanded",
            item.classList.contains("active") ? "true" : "false"
        );

        button.addEventListener("click", function () {
            const wasOpen = item.classList.contains("active");

            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove("active");

                const otherButton = otherItem.querySelector(
                    ".cv-energy-faq-question"
                );

                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }
            });

            if (!wasOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });
});