import logout from "./logout.js";
import {
  database,
  findCardByNumber,
  findBeneficiaryCard,
  transferMoney,
} from "../models/database.js";

const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  document.location = "login.html";
} else {
  const { name, wallet, currency } = user;

  // Dashboard 
  const greetingName = document.getElementById("greetingName");
  const availableBalance = document.getElementById("availableBalance");
  const activeCards = document.getElementById("activeCards");
  const monthlyExpenses = document.getElementById("monthlyExpenses");
  const monthlyIncome = document.getElementById("monthlyIncome");
  const logoutBtn = document.getElementById("logout");

  // Transfer 
  const quickTransferBtn = document.getElementById("quickTransfer");
  const transferSection = document.getElementById("transfer-section");
  const closeTransferBtn = document.getElementById("closeTransferBtn");
  const cancelTransferBtn = document.getElementById("cancelTransferBtn");
  const transferForm = document.getElementById("transferForm");
  const beneficiarySelect = document.getElementById("beneficiary");
  const sourceCardSelect = document.getElementById("sourceCard");
  const amountInput = document.getElementById("amount");
  const transferMessage = document.getElementById("transferMessage");


  // Dashboard display
  function updateDashboard() {
    greetingName.textContent = name;

    availableBalance.textContent =
      wallet.cards.reduce((sum, card) => sum + card.balance, 0) + " " + currency;

    activeCards.textContent = wallet.cards.filter((card) => {
      const expiryDate = new Date(card.expiry.split("-").reverse().join("-"));
      return expiryDate > new Date();
    }).length;

    monthlyExpenses.textContent =
      wallet.transactions
        .filter((transaction) => transaction.type === "debit")
        .reduce((sum, transaction) => sum + transaction.amount, 0) +
      " " +
      currency;

    monthlyIncome.textContent =
      wallet.transactions
        .filter((transaction) => transaction.type === "credit")
        .reduce((sum, transaction) => sum + transaction.amount, 0) +
      " " +
      currency;
  }


  // Show cards 
  function showUserCards() {
    sourceCardSelect.innerHTML =
      '<option value="" disabled selected>Sélectionner une carte</option>';

    for (const card of user.wallet.cards) {
      sourceCardSelect.innerHTML += `
        <option value="${card.numcards}">
          ${card.type} - ${card.numcards} - ${card.balance} ${currency}
        </option>
      `;
    }
  }


  // Show beneficiaries
  function showBeneficiaries() {
    beneficiarySelect.innerHTML =
      '<option value="" disabled selected>Choisir un bénéficiaire</option>';

    for (const dbUser of database.users) {
      if (dbUser.id !== user.id) {
        for (const card of dbUser.wallet.cards) {
          beneficiarySelect.innerHTML += `
            <option value="${card.numcards}">
              ${dbUser.name} - ${card.numcards}
            </option>
          `;
        }
      }
    }
  }


  // Transfer message
  function showTransferMessage(message, isError = true) {
    if (!transferMessage) return;
    transferMessage.textContent = message;
    transferMessage.style.color = isError ? "red" : "green";
  }

  // Open / close transfer section
  if (quickTransferBtn) {
    quickTransferBtn.addEventListener("click", () => {
      transferSection.classList.remove("hidden");
      showTransferMessage("", false);
    });
  }

  if (closeTransferBtn) {
    closeTransferBtn.addEventListener("click", () => {
      transferSection.classList.add("hidden");
    });
  }

  if (cancelTransferBtn) {
    cancelTransferBtn.addEventListener("click", () => {
      transferSection.classList.add("hidden");
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Step 1: check amount
  function checkAmount(amount, callback) {
    setTimeout(() => {
      if (!amount || isNaN(amount) || amount <= 0) {
        callback("Invalid amount");
      } else {
        callback(null);
      }
    }, 500);
  }

  // Step 2: check source card
  function checkSourceCard(cardNumber, callback) {
    setTimeout(() => {
      const sourceCard = findCardByNumber(user, cardNumber);

      if (!sourceCard) {
        callback("Source card not found");
      } else {
        callback(null, sourceCard);
      }
    }, 500);
  }

  // Step 3: check beneficiary
  function checkBeneficiary(cardNumber, callback) {
    setTimeout(() => {
      const beneficiaryData = findBeneficiaryCard(cardNumber);

      if (!beneficiaryData) {
        callback("Beneficiary not found");
      } else {
        callback(null, beneficiaryData);
      }
    }, 500);
  }

  // Step 4: check balance
  function checkBalance(sourceCard, amount, callback) {
    setTimeout(() => {
      if (sourceCard.balance < amount) {
        callback("Insufficient balance");
      } else {
        callback(null);
      }
    }, 500);
  }

  // Step 5: create transfer
  function createTransfer(sourceCard, beneficiaryData, amount, callback) {
    setTimeout(() => {
      const result = transferMoney(
        user,
        sourceCard,
        beneficiaryData.user,
        beneficiaryData.card,
        amount
      );

      if (!result) {
        callback("Transfer failed");
      } else {
        callback(null, result);
      }
    }, 500);
  }

  // Transfer submit
  if (transferForm) {
    transferForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const amount = Number(amountInput.value);
      const sourceCardNumber = sourceCardSelect.value;
      const beneficiaryCardNumber = beneficiarySelect.value;

      showTransferMessage("Processing transfer...", false);

      checkAmount(amount, (err) => {
        if (err) {
          showTransferMessage(err);
          return;
        }

        checkSourceCard(sourceCardNumber, (err, sourceCard) => {
          if (err) {
            showTransferMessage(err);
            return;
          }

          checkBeneficiary(beneficiaryCardNumber, (err, beneficiaryData) => {
            if (err) {
              showTransferMessage(err);
              return;
            }

            if (sourceCard.numcards === beneficiaryData.card.numcards) {
              showTransferMessage("You cannot transfer to the same card");
              return;
            }

            checkBalance(sourceCard, amount, (err) => {
              if (err) {
                showTransferMessage(err);
                return;
              }

              createTransfer(sourceCard, beneficiaryData, amount, (err, result) => {
                if (err) {
                  showTransferMessage(err);
                  return;
                }

                sessionStorage.setItem("user", JSON.stringify(user));

                updateDashboard();
                showUserCards();
                transferForm.reset();

                showTransferMessage("Transfer completed successfully", false);

                console.log("Debit transaction:", result.debitTransaction);
                console.log("Credit transaction:", result.creditTransaction);
              });
            });
          });
        });
      });
    });
  }

  //afficher les données au chargement de la page
  updateDashboard();
  showUserCards();
  showBeneficiaries();
}