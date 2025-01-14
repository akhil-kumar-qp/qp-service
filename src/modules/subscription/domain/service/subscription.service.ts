import { PaymentGateWayService } from 'src/modules/integrations/payment-gateway/service/payment-gateway.service';
import { UpdateSubscriptionDto } from '../../application/dto/update-subscription.dto';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { Plan } from '../types/plan.type';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly paymentGateWayService: PaymentGateWayService,
  ) {}

  private validateSubscriptionUpdate(exisitingPlan: Plan, newPlan: Plan): void {
    if (newPlan.planPrice < exisitingPlan.planPrice) {
      throw new BadRequestException(
        'Cannot degrade form existing plan. Please contact support.',
      );
    }

    return;
  }

  private async findSubscriptionByPlanIdOrThrow(planId: number): Promise<Plan> {
    const data =
      await this.subscriptionRepository.findSubscriptionByPlanId(planId);
    if (!data) {
      throw new InternalServerErrorException(
        `Plan not found for planId: ${planId}`,
      );
    }
    return data;
  }

  async findSubscriptionByUserIdOrThrow(userId: number): Promise<Plan> {
    const data =
      await this.subscriptionRepository.findSubscriptionByUserId(userId);

    if (!data) {
      throw new InternalServerErrorException(
        `Plan not found for userId: ${userId}`,
      );
    }

    if (data.endDate < new Date()) {
      throw new InternalServerErrorException(
        `Plan expired for userId: ${userId}`,
      );
    }

    return data;
  }

  async updateSubscription(
    userId: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Plan> {
    const exisitingPlan = await this.findSubscriptionByUserIdOrThrow(userId);

    const newPlan = await this.findSubscriptionByPlanIdOrThrow(
      updateSubscriptionDto.planId,
    );

    this.validateSubscriptionUpdate(exisitingPlan, newPlan);

    const paymentId = await this.paymentGateWayService.purchaseSubscription(
      userId,
      newPlan,
      updateSubscriptionDto,
    );

    // Create user payment after successful payment
    await this.subscriptionRepository.createUserPayment(
      userId,
      newPlan.planId,
      paymentId,
    );

    return newPlan;
  }
}
