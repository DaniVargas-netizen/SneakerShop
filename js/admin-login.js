function login() {
  let u = user.value;
  let p = pass.value;

  if (u === "admin" && p === "1234") {
    localStorage.setItem("usuario", u);
    window.location = "admin.html";
  } else {
    msg.innerText = "Datos incorrectos";
  }
}
