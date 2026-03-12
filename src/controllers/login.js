import finduserbymail from "../models/database.js";

const mailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");
const submitbtn = document.getElementById("submitbtn");
//??
const resultEl = document.getElementById("result");

submitbtn.addEventListener("click", handleSubmit);

function handleSubmit(){
    let mail = mailInput.value;
    let password = passwordInput.value;

    setTimeout(() => {
        if (!mail || !password) {
                    alert("Veuillez remplir tous les champs.");
                    return; 
                }
                else{
                const user = finduserbymail(mail, password);
                if (user) {
                    document
            }
        }
    }, timeout);
}