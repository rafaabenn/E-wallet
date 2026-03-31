import {getbeneficiaries, finduserbyaccount, findbeneficiarieByid} from "../Models/database.js";

const user = JSON.parse(sessionStorage.getItem("currentUser"));

// Guard
if (!user) {
  alert("User not authenticated");
  window.location.href = "/index.html";
}

// DOM elements
const greetingName = document.getElementById("greetingName");
const currentDate = document.getElementById("currentDate");
const solde = document.getElementById("availableBalance");
const incomeElement = document.getElementById("monthlyIncome");
const expensesElement = document.getElementById("monthlyExpenses");
const activecards = document.getElementById("activeCards");
const transactionsList = document.getElementById("recentTransactionsList");

const transferBtn = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transferPopup");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCard = document.getElementById("sourceCard");
const sourceCardR = document.getElementById("rechargeCard");


// Events Transfer
transferBtn.addEventListener("click", handleTransfersection);
closeTransferBtn.addEventListener("click", closeTransfer);
cancelTransferBtn.addEventListener("click", closeTransfer);
document.getElementById("transferForm").addEventListener("submit", handleTransfer); 
// Events Recharger
const rechargerBtn = document.getElementById("quickTopup");
const rechargerSection = document.getElementById("rechargerPopup");
const closeRechargerBtn = document.getElementById("closeRechargerBtn");
const cancelRechargeBtn = document.getElementById("cancelRechargeBtn");

rechargerBtn.addEventListener("click", handleRechargersection);
closeRechargerBtn.addEventListener("click", closeRecharger);
cancelRechargeBtn.addEventListener("click", closeRecharger);
document.getElementById("rechargerForm").addEventListener("submit", handleRecharger); 


const getDashboardData = () => {
  const monthlyIncome = user.wallet.transactions
    .filter(t => t.type === "credit")
    .reduce((total, t) => total + t.amount, 0);

  const monthlyExpenses = user.wallet.transactions
    .filter(t => t.type === "debit")
    .reduce((total, t) => total + t.amount, 0);

  return {
    userName: user.name,
    currentDate: new Date().toLocaleDateString("fr-FR"),
    availableBalance: `${user.wallet.balance} ${user.wallet.currency}`,
    activeCards: user.wallet.cards.length,
    monthlyIncome: `${monthlyIncome} MAD`,
    monthlyExpenses: `${monthlyExpenses} MAD`,
  };
};

function renderDashboard() {
  const dashboardData = getDashboardData();
  greetingName.textContent = dashboardData.userName;
  currentDate.textContent = dashboardData.currentDate;
  solde.textContent = dashboardData.availableBalance;
  incomeElement.textContent = dashboardData.monthlyIncome;
  expensesElement.textContent = dashboardData.monthlyExpenses;
  activecards.textContent = dashboardData.activeCards;

  transactionsList.innerHTML = "";
  user.wallet.transactions.forEach(transaction => {
    const transactionItem = document.createElement("div");
    transactionItem.className = "transaction-item";
    transactionItem.innerHTML = `
      <div>${transaction.date}</div>
      <div>${transaction.amount} MAD</div>
      <div>${transaction.type}</div>
    `;
    transactionsList.appendChild(transactionItem);
  });
}
renderDashboard();

// -----------Transfer ----------------

function closeTransfer() {
  transferSection.classList.remove("active");
  document.body.classList.remove("popup-open");
}

function handleTransfersection() {
  transferSection.classList.add("active");
  document.body.classList.add("popup-open");
}

const beneficiaries = getbeneficiaries(user.id);

function renderBeneficiaries() {
  beneficiaries.forEach((beneficiary) => {
    const option = document.createElement("option");
    option.value = beneficiary.id;
    option.textContent = beneficiary.name;
    beneficiarySelect.appendChild(option);
  });
}
renderBeneficiaries();

function renderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type + "****" + card.numcards;
    sourceCard.appendChild(option);
  });
}
renderCards();

function checkUser(numcompte) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const destinataire = finduserbyaccount(numcompte);
      if (!destinataire) {
        reject("Destinataire non trouvé");
      } else {
        resolve(destinataire);
      }
    }, 1000);
  });
}

function checkSolde(expediteur, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (expediteur.wallet.balance < amount) {
        reject("Solde insuffisant");
      } else {
        resolve("Solde suffisant");
      }
    }, 1000);
  });
}

function updateSolde(expediteur, destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      expediteur.wallet.balance -= amount;
      destinataire.wallet.balance += amount;
      resolve("Solde mis à jour");
    }, 1000);
  });
}

function addtransactions(expediteur, destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      expediteur.wallet.transactions.push({
        amount, description: "Transfer sent",
        type: "debit", status: "completed",
        date: new Date().toLocaleDateString()
      });
      destinataire.wallet.transactions.push({
        amount, description: "Transfer received",
        type: "credit", status: "completed",
        date: new Date().toLocaleDateString()
      });
      resolve("Transactions ajoutées");
    }, 1000);
  });
}

function transfer(expediteur, numcompte, amount) {
  checkUser(numcompte)
    .then((destinataire) => checkSolde(expediteur, amount).then(() => destinataire))
    .then((destinataire) => updateSolde(expediteur, destinataire, amount).then(() => destinataire))
    .then((destinataire) => addtransactions(expediteur, destinataire, amount))
    .then(() => {
      alert("Transfert réussi !");
      renderDashboard();
      closeTransfer();
    })
    .catch((error) => {
      alert(error);
    });
}

function handleTransfer(e) {
  e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount = findbeneficiarieByid(user.id, beneficiaryId).account;
  const amount = Number(document.getElementById("amount").value);

  transfer(user, beneficiaryAccount, amount);
}

// -----------Recharger-------
function closeRecharger() {
  rechargerSection.classList.remove("active");
  document.body.classList.remove("popup-open");
}

function handleRechargersection() {
  rechargerSection.classList.add("active");
  document.body.classList.add("popup-open");
}

function renderCardsR() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type + "****" + card.numcards;
    sourceCardR.appendChild(option);
  });
}
renderCardsR();

function checkAmount(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!amount || isNaN(amount)) {
        reject("Veuillez entrer un montant valide");
      } else if (amount < 10) {
        reject("Le montant minimum est 10 MAD");
      } else if (amount > 5000) {
        reject("Le montant maximum est 5000 MAD");
      } else {
        resolve(amount);
      }
    }, 500);
  });
}

function checkCard(numcard, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const card = user.wallet.cards.find(c => String(c.numcards) === String(numcard));
      if (!card) {
        reject("Carte non trouvée");
      } else if (card.balance < amount) {
        reject("Solde de la carte insuffisant");
      } else if (new Date(card.expiry) < new Date()) {
        reject("Carte expirée");
      } else {
        resolve(card);
      }
    }, 1000);
  });
}

function updateSoldeRecharger(expediteur, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      expediteur.wallet.balance += amount;
      resolve("Solde mis à jour");
    }, 1000);
  });
}

function addRechargerTransaction(expediteur, amount, valid) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      expediteur.wallet.transactions.push({
        amount,
        description: valid ? "Recharge valide" : "Recharge échouée",
        type: valid ? "recharge(succee)" : "recharge(echoue)",
        status: valid ? "succee" : "echoue",
        date: new Date().toLocaleDateString()
      });
      valid ? resolve("Transaction ajoutée") : reject("Transaction échouée enregistrée");
    }, 1000);
  });
}


function recharger(expediteur, numcard, amount) {
  checkAmount(amount)
    .then(() => checkCard(numcard, amount))
    .then(() => updateSoldeRecharger(expediteur, amount))
    .then(() => addRechargerTransaction(expediteur, amount, true))
    .then(() => {alert("Recharge effectuée avec succès !"); })
    
    .catch((error) => {
      alert(error); 
      return addRechargerTransaction(expediteur, amount, false).catch(() => {});
    })
    .finally(() => {
      renderDashboard();
      closeRecharger();
    });
}

function handleRecharger(e) {
  e.preventDefault();

  const numcard = Number(document.getElementById("rechargeCard").value);
  const amount = Number(document.getElementById("rechargeAmount").value);

  recharger(user, numcard, amount);
}