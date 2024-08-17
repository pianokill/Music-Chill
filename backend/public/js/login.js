const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const password = document.querySelector(".showpassword");
const up_password = document.querySelector(".up-showpassword");
//
const usernameData = document.getElementById("username");
const passworData = document.getElementById("password");
const btnIn = document.getElementById("btnIn")
//
const usernameDataUp = document.getElementById("username-signup");
const passworDataUp = document.getElementById("password-signup");
const password_cm = document.getElementById("password-cm");
const emailDataUp = document.getElementById("email-signup");
const btnUp = document.getElementById("btnUp");

//Hidden password
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

password.addEventListener("click", () => {
  password.querySelector("i").classList.toggle("fa-eye");
  if (document.querySelector(".sign-in-password").type == "password") {
    document.querySelector(".sign-in-password").type = "text";
  } else document.querySelector(".sign-in-password").type = "password";
});

up_password.addEventListener("click", () => {
  up_password.querySelector("i").classList.toggle("fa-eye");
  if (document.querySelector(".sign-up-password").type == "password") {
    document.querySelectorAll(".sign-up-password").forEach((element) => {
      element.type = "text";
    });
  } else {
    document.querySelectorAll(".sign-up-password").forEach((element) => {
      element.type = "password";
    });
  }
});

//post sign up

btnUp.addEventListener("click", async () => {
  const password = passworDataUp.value;
  const password1 = password_cm.value;
  const form = document.getElementById("form-sign-up");

  const data = new FormData(form);

  if (password != password1) {
    console.log("Passwword is not match");
    alert("password is not match!!!");
    return;
  }
  else {
    try {
      let res = await fetch("/auth/signUp", {
        method: "POST",
        body: data
      })
      res = await res.json();
      if (res.error) {
        alert(res.message);
      } else {
        alert(res.message);
        window.location.href = '/auth';
      }
    } catch (error) {
      console.log(error);
    }
  }
});