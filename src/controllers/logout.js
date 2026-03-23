function logout() {
  sessionStorage.removeItem("currentUser");
  document.location = "login.html";
}

export default logout;