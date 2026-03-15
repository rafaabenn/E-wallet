import {findUserByMail} from "../models/database.js";

const mail = document.querySelector("#mail");
const password = document.querySelector("#password");
const submit = document.querySelector("#submitbtn");

submit.addEventListener("click", handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    const mailValue = mail.value;
    const passwordValue = password.value;
    
    submit.textContent = "checking ...";
    // simulation de la connexion à la BD
    setTimeout(() => {
        const user = findUserByMail(mailValue, passwordValue);
        if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));

        // rediriger vers dashboard
        document.location = "dashboard.html";
        } else {
        alert("Invalid email or password");
        }
    }, 1000);
}