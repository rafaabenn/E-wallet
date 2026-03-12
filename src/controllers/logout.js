function logout() {
  sessionStorage.removeItem("user");
  document.location = "login.html";
}

export default logout;