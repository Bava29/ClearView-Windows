
/* =====================================
   CLEARVIEW WINDOWS - AUTH JAVASCRIPT
===================================== */

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    const themeToggle = document.getElementById("authThemeToggle");
    const rtlToggle = document.getElementById("authRtlToggle");

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
            // Continue working without saved preferences.
        }
    }

    // ---------------------------------
    // DARK MODE
    // ---------------------------------

    function applyTheme(isDark) {
        root.classList.toggle("dark-mode", isDark);

        savePreference(
            "clearview-theme",
            isDark ? "dark" : "light"
        );

        if (themeToggle) {
            themeToggle.innerHTML = isDark
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';

            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Enable light mode" : "Enable dark mode"
            );

            themeToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );
        }
    }

    applyTheme(getPreference("clearview-theme") === "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            applyTheme(!root.classList.contains("dark-mode"));
        });
    }

    // ---------------------------------
    // RTL MODE
    // ---------------------------------

    function applyDirection(isRTL) {
        root.setAttribute("dir", isRTL ? "rtl" : "ltr");

        savePreference(
            "clearview-direction",
            isRTL ? "rtl" : "ltr"
        );

        if (rtlToggle) {
            const label = rtlToggle.querySelector("span");

            if (label) {
                label.textContent = isRTL ? "LTR" : "RTL";
            }

            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Disable RTL mode" : "Enable RTL mode"
            );

            rtlToggle.setAttribute(
                "aria-pressed",
                String(isRTL)
            );
        }
    }

    applyDirection(getPreference("clearview-direction") === "rtl");

    if (rtlToggle) {
        rtlToggle.addEventListener("click", () => {
            const isRTL = root.getAttribute("dir") === "rtl";
            applyDirection(!isRTL);
        });
    }

    // ---------------------------------
    // PASSWORD SHOW / HIDE
    // ---------------------------------

    document.querySelectorAll("[data-password-target]")
        .forEach((button) => {

            button.addEventListener("click", () => {
                const targetId = button.dataset.passwordTarget;
                const input = document.getElementById(targetId);

                if (!input) return;

                const showPassword = input.type === "password";

                input.type = showPassword ? "text" : "password";

                button.innerHTML = showPassword
                    ? '<i class="fa-regular fa-eye-slash"></i>'
                    : '<i class="fa-regular fa-eye"></i>';

                button.setAttribute(
                    "aria-label",
                    showPassword ? "Hide password" : "Show password"
                );

                button.setAttribute(
                    "aria-pressed",
                    String(showPassword)
                );
            });
        });

    // ---------------------------------
    // REGISTER PASSWORD VALIDATION
    // ---------------------------------

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                event.preventDefault();

                document.getElementById("confirmPassword")
                    .setCustomValidity("Passwords do not match.");

                document.getElementById("confirmPassword")
                    .reportValidity();

                return;
            }

            document.getElementById("confirmPassword")
                .setCustomValidity("");

            // No account is created without a backend.
            event.preventDefault();
            alert("Registration UI is ready. Connect a backend to create your account.");
        });

        const confirmPassword =
            document.getElementById("confirmPassword");

        confirmPassword.addEventListener("input", () => {
            confirmPassword.setCustomValidity("");
        });
    }

    // ---------------------------------
    // LOGIN FORM DEMO
    // ---------------------------------

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            alert("Login UI is ready. Connect authentication to sign in.");
        });
    }

    // ---------------------------------
    // GOOGLE SIGN-IN PLACEHOLDER
    // ---------------------------------

    ["googleLogin", "googleRegister"].forEach((id) => {
        const button = document.getElementById(id);

        if (button) {
            button.addEventListener("click", () => {
                alert("Google Sign-In requires Google OAuth configuration.");
            });
        }
    });
});
