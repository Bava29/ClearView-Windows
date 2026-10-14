
/* ==========================================
   CLEARVIEW WINDOWS - DASHBOARD JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    const sidebar = document.getElementById("cvSidebar");
    const sidebarToggle = document.getElementById("cvSidebarToggle");
    const sidebarClose = document.getElementById("cvSidebarClose");
    const sidebarOverlay = document.getElementById("cvSidebarOverlay");

    const themeToggle = document.getElementById("cvDashboardTheme");
    const rtlToggle = document.getElementById("cvDashboardRTL");

    const notificationToggle =
        document.getElementById("cvNotificationToggle");
    const notificationPanel =
        document.getElementById("cvNotificationPanel");

    const mobileBreakpoint = window.matchMedia("(max-width: 1024px)");

    // Safe localStorage helpers
    function getPreference(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Current-page functionality remains available.
        }
    }

    // --------------------------------------
    // SIDEBAR OPEN / CLOSE
    // --------------------------------------

    function openSidebar() {
        sidebar.classList.add("is-open");
        sidebarOverlay.classList.add("is-visible");

        sidebarToggle.setAttribute("aria-expanded", "true");
        sidebarToggle.setAttribute("aria-label", "Close sidebar");

        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("is-open");
        sidebarOverlay.classList.remove("is-visible");

        sidebarToggle.setAttribute("aria-expanded", "false");
        sidebarToggle.setAttribute("aria-label", "Open sidebar");

        document.body.style.overflow = "";
    }

    sidebarToggle.addEventListener("click", () => {
        if (mobileBreakpoint.matches) {
            if (sidebar.classList.contains("is-open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        } else {
            sidebar.classList.toggle("is-collapsed");
            root.classList.toggle(
                "cv-sidebar-collapsed",
                sidebar.classList.contains("is-collapsed")
            );
        }
    });

    sidebarClose.addEventListener("click", closeSidebar);
    sidebarOverlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
            closeNotifications();
        }
    });

    mobileBreakpoint.addEventListener("change", (event) => {
        closeSidebar();

        if (!event.matches) {
            sidebar.classList.remove("is-collapsed");
            root.classList.remove("cv-sidebar-collapsed");
        }
    });

    // --------------------------------------
    // DESKTOP SIDEBAR COLLAPSE
    // --------------------------------------

    // Collapse styles are supplied in dashboard.css.

    // --------------------------------------
    // DARK MODE
    // --------------------------------------

    function applyTheme(isDark) {
        root.classList.toggle("dark-mode", isDark);

        savePreference(
            "clearview-theme",
            isDark ? "dark" : "light"
        );

        themeToggle.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Enable light mode" : "Enable dark mode"
        );

        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.title = isDark ? "Light mode" : "Dark mode";
    }

    applyTheme(getPreference("clearview-theme") === "dark");

    themeToggle.addEventListener("click", () => {
        applyTheme(!root.classList.contains("dark-mode"));
    });

    // --------------------------------------
    // RTL MODE
    // --------------------------------------

    function applyDirection(isRTL) {
        root.setAttribute("dir", isRTL ? "rtl" : "ltr");

        savePreference(
            "clearview-direction",
            isRTL ? "rtl" : "ltr"
        );

        rtlToggle.setAttribute("aria-pressed", String(isRTL));
        rtlToggle.setAttribute(
            "aria-label",
            isRTL ? "Disable RTL mode" : "Enable RTL mode"
        );

        rtlToggle.title = isRTL ? "Switch to LTR" : "Switch to RTL";
    }

    applyDirection(getPreference("clearview-direction") === "rtl");

    rtlToggle.addEventListener("click", () => {
        const isRTL = root.getAttribute("dir") === "rtl";
        applyDirection(!isRTL);
    });

    // --------------------------------------
    // NOTIFICATIONS PANEL
    // --------------------------------------

    function closeNotifications() {
        notificationPanel.hidden = true;
        notificationToggle.setAttribute("aria-expanded", "false");
    }

    notificationToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpening = notificationPanel.hidden;

        notificationPanel.hidden = !isOpening;

        notificationToggle.setAttribute(
            "aria-expanded",
            String(isOpening)
        );
    });

    notificationPanel.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
        if (
            !notificationPanel.contains(event.target) &&
            !notificationToggle.contains(event.target)
        ) {
            closeNotifications();
        }
    });

    // --------------------------------------
    // ACTIVE SIDEBAR MENU
    // --------------------------------------

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "dashboard.html";

    document.querySelectorAll(".cv-sidebar-link").forEach((link) => {
        const linkPage = new URL(link.href).pathname
            .split("/")
            .pop()
            .toLowerCase();

        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

});


/* ==========================================
   LOGOUT CONFIRMATION
========================================== */

const logoutBtn = document.getElementById("cvLogoutBtn");
const logoutOverlay = document.getElementById("cvLogoutOverlay");
const logoutNo = document.getElementById("cvLogoutNo");
const logoutYes = document.getElementById("cvLogoutYes");

function openLogoutModal() {
    logoutOverlay.classList.add("is-visible");
    logoutOverlay.setAttribute("aria-hidden", "false");
    logoutNo.focus();
}

function closeLogoutModal() {
    logoutOverlay.classList.remove("is-visible");
    logoutOverlay.setAttribute("aria-hidden", "true");
    logoutBtn.focus();
}

logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    openLogoutModal();
});

logoutNo.addEventListener("click", closeLogoutModal);

// Click outside the popup to close
logoutOverlay.addEventListener("click", (event) => {
    if (event.target === logoutOverlay) {
        closeLogoutModal();
    }
});

// Escape key to close
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        logoutOverlay.classList.contains("is-visible")
    ) {
        closeLogoutModal();
    }
});

// Confirm logout
logoutYes.addEventListener("click", () => {
    window.location.href = "login.html";
});
