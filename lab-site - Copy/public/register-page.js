// public/register-page.js
// Handles user registration form submission.

const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const role = document.getElementById("role").value;

    // Validate passwords match
    if (password !== confirmPassword) {
      registerMessage.textContent = "❌ Passwords do not match";
      registerMessage.style.color = "red";
      registerMessage.classList.add("show");
      return;
    }

    registerMessage.textContent = "Creating account...";
    registerMessage.style.color = "#666";
    registerMessage.classList.add("show");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      registerMessage.textContent =
        "✅ Account created successfully! Redirecting to login...";
      registerMessage.style.color = "green";

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      registerMessage.textContent = "❌ " + err.message;
      registerMessage.style.color = "red";
    }
  });
}
