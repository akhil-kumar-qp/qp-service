// mocking database data
const USER_DATA = [
  {
    id: 7,
    name: 'John Doe',
    email: 'J0n3Y@example.com',
    password: 'password',
    autoRenew: true,
  },
];

const USER_CARD_DATA = [
  {
    id: 1,
    userId: 7,
    cardNumber: '1234567890123456',
    cardHolder: 'John Doe',
    month: 12,
    year: 25,
    cvv: '123',
  },
];

export class UserRepository {
  async findUserByEmail(email: string) {
    return USER_DATA.find((user) => user.email === email);
  }

  async findById(id: number) {
    return USER_DATA.find((user) => user.id === id);
  }

  async findUsersWithAutoRenewal() {
    return USER_DATA.filter((user) => user.autoRenew)
      .map((user) => {
        const cardInfo = USER_CARD_DATA.find((card) => card.userId === user.id);
        if (cardInfo) {
          return {
            ...user,
            cardInfo: {
              cardNumber: cardInfo.cardNumber,
              cardHolder: cardInfo.cardHolder,
              month: cardInfo.month,
              year: cardInfo.year,
              cvv: cardInfo.cvv,
            },
          };
        }
        return null; // Return null if no card info found for the user
      })
      .filter((user) => user !== null);
  }
}
