document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "Ghalib_craft" && password === "Ghamatchu") {
            alert("Login successful!");
           window.location.href = "admin.html";
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });
});
