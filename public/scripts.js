document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("role");
  const signupFormContainer = document.getElementById("signup-form-container");

  roleSelect.addEventListener("change", () => {
    const role = roleSelect.value;
    let formHTML = "";

    switch (role) {
      case "student":
        formHTML = `
              <div class="signup-form">
                <h3>Student Sign Up</h3>
                <form id="student-signup-form">
                  <div class="form-group">
                    <label for="student-name">Full Name:</label>
                    <input type="text" id="student-name" name="username" required placeholder="Enter your name">
                  </div>
                  <div class="form-group">
                    <label for="student-email">Email:</label>
                    <input type="email" id="student-email" name="email" required placeholder="Enter your email">
                  </div>
                  <div class="form-group">
                    <label for="student-password">Password:</label>
                    <input type="password" id="student-password" name="password" required placeholder="Enter your password">
                  </div>
                  <button type="submit">Sign Up</button>
                </form>
              </div>
            `;
        break;
      case "teacher":
        formHTML = `
              <div class="signup-form">
                <h3>Teacher Sign Up</h3>
                <form id="teacher-signup-form">
                  <div class="form-group">
                    <label for="teacher-name">Full Name:</label>
                    <input type="text" id="teacher-name" name="username" required placeholder="Enter your name">
                  </div>
                  <div class="form-group">
                    <label for="teacher-email">Email:</label>
                    <input type="email" id="teacher-email" name="email" required placeholder="Enter your email">
                  </div>
                  <div class="form-group">
                    <label for="teacher-password">Password:</label>
                    <input type="password" id="teacher-password" name="password" required placeholder="Enter your password">
                  </div>
                  <button type="submit">Sign Up</button>
                </form>
              </div>
            `;
        break;
      case "admin":
        formHTML = `
              <div class="signup-form">
                <h3>Admin Sign Up</h3>
                <form id="admin-signup-form">
                  <div class="form-group">
                    <label for="admin-name">Full Name:</label>
                    <input type="text" id="admin-name" name="username" required placeholder="Enter your name">
                  </div>
                  <div class="form-group">
                    <label for="admin-email">Email:</label>
                    <input type="email" id="admin-email" name="email" required placeholder="Enter your email">
                  </div>
                  <div class="form-group">
                    <label for="admin-password">Password:</label>
                    <input type="password" id="admin-password" name="password" required placeholder="Enter your password">
                  </div>
                  <button type="submit">Sign Up</button>
                </form>
              </div>
            `;
        break;
      default:
        formHTML = "";
        break;
    }

    signupFormContainer.innerHTML = formHTML;
  });

  // Handle form submissions
  signupFormContainer.addEventListener("submit", async (event) => {
    if (event.target.matches("form")) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const data = {
        ...Object.fromEntries(formData),
        role: document.getElementById("role").value,
      };
      console.log(data);

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(data);

        const result = await response.json();
        if (response.ok) {
          alert("Sign-up successful!");
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

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Sign-in successful!");

        // Redirect based on the role
        if (result.role === "student") {
          window.location.href = "/student-dashboard.html";
        } else if (result.role === "teacher") {
          window.location.href = "/teacher-dashboard.html";
        } else if (result.role === "admin") {
          window.location.href = "/admin-dashboard.html";
        }
      } else {
        alert(`Error: ${result.msg}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  });
});
