document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("role");
  const formContainer = document.getElementById("signup-form-container");

  roleSelect.addEventListener("change", function () {
    const role = this.value;
    formContainer.innerHTML = ""; // Clear any existing form

    // Load the appropriate form based on the selected role
    switch (role) {
      case "student":
        formContainer.innerHTML = `
                  <div class="signup-form">
                      <h3>Student Sign Up</h3>
                      <form id="student-signup-form" action="student-signup-process.php" method="POST">
                          <div class="form-group">
                              <label for="student-name">Full Name:</label>
                              <input type="text" id="student-name" name="name" required placeholder="Enter your name">
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
        formContainer.innerHTML = `
                  <div class="signup-form">
                      <h3>Teacher Sign Up</h3>
                      <form id="teacher-signup-form" action="teacher-signup-process.php" method="POST">
                          <div class="form-group">
                              <label for="teacher-name">Full Name:</label>
                              <input type="text" id="teacher-name" name="name" required placeholder="Enter your name">
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
        formContainer.innerHTML = `
                  <div class="signup-form">
                      <h3>Admin Sign Up</h3>
                      <form id="admin-signup-form" action="admin-signup-process.php" method="POST">
                          <div class="form-group">
                              <label for="admin-name">Full Name:</label>
                              <input type="text" id="admin-name" name="name" required placeholder="Enter your name">
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
        formContainer.innerHTML = "";
        break;
    }
  });
});
