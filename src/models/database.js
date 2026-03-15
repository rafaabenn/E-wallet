const database = {
  users: [
    {
      id: "1",
      name: "Ali",
      email: "Ali@example.com",
      password: "1232",
      wallet: {
        currency: "MAD",
        cards: [
          {
            numcards: "124847",
            type: "visa",
            balance: 14712,
            expiry: "14-08-2027",
            vcc: "147",
          },
          {
            numcards: "124478",
            type: "mastercard",
            balance: 1470,
            expiry: "14-08-2028",
            vcc: "257",
          },
        ],
        transactions: [
          {
            id: "1",
            type: "credit",
            amount: 140,
            date: "14-08-2025",
            from: "Ahmed",
            to: "124847",
          },
          {
            id: "2",
            type: "debit",
            amount: 200,
            date: "13-08-2025",
            from: "124847",
            to: "Amazon",
          },
          {
            id: "3",
            type: "credit",
            amount: 250,
            date: "12-08-2025",
            from: "Ahmed",
            to: "124478",
          },
        ],
      },
    },
    {
      id: "2",
      name: "rafaa",
      email: "rafaa@gmail.com",
      password: "0000",
      wallet: {
        currency: "MAD",
        cards: [
          {
            numcards: "13487",
            type: "visa",
            balance: 2500,
            expiry: "30-04-2029",
            vcc: "147",
          },
          {
            numcards: "87654",
            type: "mastercard",
            balance: 1380,
            expiry: "09-04-2030",
            vcc: "257",
          },
        ],
        transactions: [
          {
            id: "1",
            type: "credit",
            amount: 500,
            date: "14-08-2025",
            from: "Hiba",
            to: "13487",
          },
          {
            id: "2",
            type: "debit",
            amount: 250,
            date: "13-08-2025",
            from: "13487",
            to: "Fitness Park Maroc",
          },
        ],
      },
    },
  ],
};

const findUserByMail = (mail, password) => {
  return database.users.find(
    (u) => u.email === mail && u.password === password
  );
};

const ExistBeneficaire = (numbercard) => {
  return database.users.find((u) =>
    u.wallet.cards.find((c) => c.numcards == numbercard)
  );
};

const findCardByNumber = (user, cardNumber) => {
  return user.wallet.cards.find((c) => c.numcards === cardNumber);
};

const findBeneficiaryCard = (numbercard) => {
  for (const user of database.users) {
    const card = user.wallet.cards.find((c) => c.numcards === numbercard);
    if (card) {
      return { user, card };
    }
  }
  return null;
};

const createTransaction = (type, amount, from, to) => {
  return {
    id: Date.now().toString(),
    type,
    amount,
    date: new Date().toLocaleDateString("fr-FR").split("/").join("-"),
    from,
    to,
  };
};

const transferMoney = (senderUser, senderCard, receiverUser, receiverCard, amount) => {
  senderCard.balance -= amount;
  receiverCard.balance += amount;

  const debitTransaction = createTransaction("debit", amount, senderCard.numcards, receiverCard.numcards);
  const creditTransaction = createTransaction("credit", amount, senderCard.numcards, receiverCard.numcards);

  senderUser.wallet.transactions.push(debitTransaction);
  receiverUser.wallet.transactions.push(creditTransaction);

  return { debitTransaction, creditTransaction };
};

export {
  database,
  findUserByMail,
  ExistBeneficaire,
  findCardByNumber,
  findBeneficiaryCard,
  transferMoney
};