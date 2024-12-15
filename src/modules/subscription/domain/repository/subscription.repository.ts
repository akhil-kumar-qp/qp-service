// mocking database data
const SUBSCRIPTION_PLANS = [
  {
    id: 1,
    name: 'Free',
    price: 0,
  },
  {
    id: 2,
    name: 'Premium',
    price: 10,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 50,
  },
];

const USER_SUBSCRIPTION_DATA = [
  {
    id: 1,
    userId: 7,
    planId: 1,
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const USER_PAYMENT_DATA = [
  {
    id: 1,
    userId: 7,
    planId: 1,
    paymentId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class SubscriptionRepository {
  async findSubscriptionByUserId(userId: number) {
    const subscriptionData = USER_SUBSCRIPTION_DATA.find(
      (subscription) => subscription.userId === userId,
    );

    if (!subscriptionData) {
      return null;
    }

    const subscriptionPlan = SUBSCRIPTION_PLANS.find(
      (plan) => plan.id === subscriptionData.planId,
    );

    return {
      id: subscriptionData.id,
      userId: subscriptionData.userId,
      planId: subscriptionData.planId,
      plan: subscriptionPlan,
      planPrice: subscriptionPlan.price,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      createdAt: subscriptionData.createdAt,
      updatedAt: subscriptionData.updatedAt,
    };
  }

  async findSubscriptionByPlanId(planId: number) {
    const subscriptionData = USER_SUBSCRIPTION_DATA.find(
      (subscription) => subscription.planId === planId,
    );

    if (!subscriptionData) {
      return null;
    }

    const subscriptionPlan = SUBSCRIPTION_PLANS.find(
      (plan) => plan.id === subscriptionData.planId,
    );

    return {
      id: subscriptionData.id,
      userId: subscriptionData.userId,
      planId: subscriptionData.planId,
      plan: subscriptionPlan,
      planPrice: subscriptionPlan.price,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      createdAt: subscriptionData.createdAt,
      updatedAt: subscriptionData.updatedAt,
    };
  }

  async createUserPayment(userId: number, planId: number, paymentId: number) {
    USER_PAYMENT_DATA.push({
      id: USER_PAYMENT_DATA.length + 1,
      userId: userId,
      planId: planId,
      paymentId: paymentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
