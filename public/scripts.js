document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("role");
  const signupFormContainer = document.getElementById("signup-form-container");

  // Function to generate the signup form based on user role
  const generateSignupForm = (role) => {
    return `
    <div class="signup-form">
      <h3>${role.charAt(0).toUpperCase() + role.slice(1)} Sign Up</h3>
      <form id="${role}-signup-form">
        <input type="hidden" name="role" value="${role}">
        <div class="form-group">
          <label for="${role}-name">Full Name:</label>
          <input type="text" id="${role}-name" name="username" required placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label for="${role}-email">Email:</label>
          <input type="email" id="${role}-email" name="email" required placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label for="${role}-password">Password:</label>
          <input type="password" id="${role}-password" name="password" required placeholder="Enter your password">
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  `;
  };

  // Event listener to detect role selection and generate the form
  roleSelect.addEventListener("change", () => {
    const selectedRole = roleSelect.value;

    if (selectedRole) {
      signupFormContainer.innerHTML = generateSignupForm(selectedRole);
    } else {
      signupFormContainer.innerHTML = "";
    }
  });

  // Handle signup form submission
  signupFormContainer.addEventListener("submit", async (event) => {
    if (event.target.matches("form")) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      // Validate password length
      if (data.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      try {
        // Show a loading spinner (optional for better UX)
        const loadingSpinner = document.createElement("div");
        loadingSpinner.textContent = "Signing up...";
        signupFormContainer.appendChild(loadingSpinner);

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        signupFormContainer.removeChild(loadingSpinner); // Remove loading spinner

        if (response.ok) {
          alert("Sign-up successful! Redirecting to sign-in...");
          window.location.href = "/signin.html";
        } else {
          alert(`Error: ${result.msg}`);
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signin-form");

  signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect the form data
    const formData = new FormData(signinForm);
    const data = Object.fromEntries(formData.entries());

    try {
      // Show a loading spinner (optional for better UX)
      const loadingSpinner = document.createElement("div");
      loadingSpinner.textContent = "Signing in...";
      signinForm.appendChild(loadingSpinner);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      signinForm.removeChild(loadingSpinner); // Remove loading spinner

      // If sign-in is successful
      if (response.ok) {
        alert("Sign-in successful!");

        // Save the token and user details in sessionStorage for better security
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("user", JSON.stringify(result.user));

        // Redirect based on the user's role
        if (result.user.role === "student") {
          window.location.href = "/student-dashboard.html";
        } else if (result.user.role === "teacher") {
          window.location.href = "/teacher-dashboard.html";
        } else if (result.user.role === "admin") {
          window.location.href = "/admin-dashboard.html";
        } else {
          alert("Unknown role");
        }
      } else {
        alert(`Error: ${result.msg || "Sign-in failed."}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});

// Function to load user details and display them on the dashboard
function loadUserDetails() {
  // Retrieve user data from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Check if the user data is available
  if (user) {
    // Display the user's name and email on the dashboard
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    if (userNameElement && userEmailElement) {
      userNameElement.textContent = user.name;
      userEmailElement.textContent = user.email;
    }

    // Optionally, hide the "Sign In" and "Sign Up" links and show a "Sign Out" link
    document.querySelector('a[href="signin.html"]').style.display = "none";
    document.querySelector('a[href="signup.html"]').style.display = "none";

    // Create and append a "Sign Out" link dynamically
    const signOutLink = document.createElement("li");
    signOutLink.innerHTML = '<a href="#" id="signOutLink">Sign Out</a>';
    document.querySelector("nav ul").appendChild(signOutLink);

    // Handle "Sign Out" link click event
    document.getElementById("signOutLink").addEventListener("click", () => {
      if (confirm("Are you sure you want to sign out?")) {
        // Remove user data and token from sessionStorage
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        // Redirect to the sign-in page
        window.location.href = "/signin.html";
      }
    });
  } else {
    // If user data is missing and the current page is a protected page (e.g., dashboard)
    if (window.location.pathname.includes("dashboard")) {
      // Redirect to the sign-in page if the user is not logged in
      window.location.href = "/signin.html";
    }
  }
}

// Load user details once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadUserDetails);
