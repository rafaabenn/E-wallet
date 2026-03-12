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
      name: "zakariae",
      email: "zakariae@gmail.com",
      password: "1234",
      wallet: {
        currency: "MAD",
        cards: [
          {
            numcards: "124849",
            type: "visa",
            balance: 14712,
            expiry: "14-08-2027",
            vcc: "147",
          },
          {
            numcards: "124950",
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
            from: "Meriem",
            to: "124849",
          },
          {
            id: "2",
            type: "debit",
            amount: 200,
            date: "13-08-2025",
            from: "124849",
            to: "Youssef Market Place",
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

export { findUserByMail, ExistBeneficaire };