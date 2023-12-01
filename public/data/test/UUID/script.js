
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({"username": username, "password": password}),
      headers: {"Content-Type": "application/json"}
    }).then(async (response) => {
      const data = {};
      data.json = await response.json();
      data.status = response.status;
      if (data.status == 200) {
        
       showAlertWithoutButton(data.json.message, "green", 3000);
      }
    });
  });
   function showAlertWithoutButton(alertText, color, hideAfter) {
    const alertContainer = createAlertContainer();
    const alertTextElement = createAlertText(alertText);
    alertContainer.style.backgroundColor = color;

    alertContainer.appendChild(alertTextElement);

    document.body.appendChild(alertContainer);

    setTimeout(() => {
      alertContainer.style.display = "none";
      window.location.href = "/admin/admin.html"
    }, hideAfter);
  }
});
