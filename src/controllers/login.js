import {findUserByMail} from "../Models/database.js";
const mail = document.querySelector("#mail");
const password = document.querySelector("#password");
const submit = document.querySelector("#submitbtn");

submit.addEventListener("click", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const mailValue = mail.value;
  const passwordValue = password.value;
  
  submit.textContent = "checking ...";
  // simuler la connexion à la base de données
  setTimeout(() => {
    const user = findUserByMail(mailValue, passwordValue);
    if (user) {
      // stocker l'objet user dans le sessionStorage
      sessionStorage.setItem("user", JSON.stringify(user));

      // rediriger vers la page dashboard
      document.location = "dashboard.html";
    } else {
      alert("Invalid email or password");
    }
  }, 1000);
}