import logout from "./logout.js";

const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
    document.location = "Login.html";
} else {
    const { name, wallet, wallet: { cards, transactions, currency } } = user;
    
    document.getElementById("greetingName").textContent = name;
    
    document.getElementById("availableBalance").textContent = 
        cards.reduce((sum, c) => sum + c.balance, 0) + " " + currency;
    
    document.getElementById("activeCards").textContent = 
        cards.filter(c => new Date(c.expiry.split("-").reverse().join("-")) > new Date()).length;
    
    document.getElementById("monthlyExpenses").textContent = 
        transactions.filter(t => t.type === "debit").reduce((sum, t) => sum + t.amount, 0) + " " + currency;
    
    document.getElementById("monthlyIncome").textContent = 
        transactions.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0) + " " + currency;
    
    document.getElementById("logout").addEventListener("click", logout);
}
