import { PaymentGateWayService } from 'src/modules/integrations/payment-gateway/service/payment-gateway.service';
import { UpdateSubscriptionDto } from '../../application/dto/update-subscription.dto';
import { SubscriptionRepository } from '../repository/subscription.repository';

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly paymentGateWayService: PaymentGateWayService,
  ) {}

  private async validateSubscriptionUpdate(exisitingPlan: any, newPlan: any) {
    if (!newPlan) {
      throw Error('Subscription not found for renewal');
    }

    if (newPlan.planPrice < exisitingPlan.planPrice) {
      throw Error('Cannot degrade form existing plan');
    }

    return newPlan;
  }

  async findSubscriptionByUserId(userId: number) {
    const data =
      await this.subscriptionRepository.findSubscriptionByUserId(userId);

    if (!data) {
      throw Error('Subscription not found');
    }
    return data;
  }

  async updateSubscription(
    userId: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const exisitingPlan = await this.findSubscriptionByUserId(userId);

    const newPlan = await this.subscriptionRepository.findSubscriptionByPlanId(
      updateSubscriptionDto.planId,
    );

    await this.validateSubscriptionUpdate(exisitingPlan, newPlan);

    await this.paymentGateWayService.purchaseSubscription(
      userId,
      newPlan,
      updateSubscriptionDto,
    );
    return;
  }

  async createUserPayment(userId: number, planId: number, paymentId: number) {
    return await this.subscriptionRepository.createUserPayment(
      userId,
      planId,
      paymentId,
    );
  }
}
