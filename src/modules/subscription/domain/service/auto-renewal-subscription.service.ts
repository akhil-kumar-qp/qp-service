import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from 'src/modules/subscription/domain/service/subscription.service';
import { UpdateSubscriptionDto } from 'src/modules/subscription/application/dto/update-subscription.dto';
import { UserService } from 'src/modules/user/domain/service/user.service';
import { PaymentGateWayService } from 'src/modules/integrations/payment-gateway/service/payment-gateway.service';
import { CustomLogger } from 'src/common-lib/utility/custom-logger';

@Injectable()
export class AutoRenewalService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly paymentGatewayService: PaymentGateWayService,
    private readonly userService: UserService,
    private readonly customLogger: CustomLogger,
  ) {}

  // runs at midnight every day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutoRenewal() {
    // NOTE: Process this in batches

    // Fetch all users who have autoRenewal enabled
    const usersWithAutoRenewal =
      await this.userService.findUsersWithAutoRenewal();

    for (const user of usersWithAutoRenewal) {
      try {
        // Fetch the user's current subscription plan details
        const planData =
          await this.subscriptionService.findSubscriptionByUserId(user.id);

        if (!planData) {
          this.customLogger.error(
            `No active subscription found for user ${user.id}`,
          );
          continue;
        }

        const cardInfo: UpdateSubscriptionDto = {
          cardNumber: user.cardInfo.cardNumber,
          cvv: user.cardInfo.cvv,
          month: user.cardInfo.month,
          year: user.cardInfo.year,
          name: user.cardInfo.cardHolder,
          planId: planData.planId,
          patmentGatewayInitToken:
            await this.paymentGatewayService.getPaymentGatewayToken(user.id),
        };

        // Call the payment gateway service to renew the subscription
        const renewalSuccessful =
          await this.paymentGatewayService.purchaseSubscription(
            user.id,
            planData,
            cardInfo,
          );

        if (renewalSuccessful) {
          this.customLogger.info(
            `Subscription renewed successfully for user ${user.id}`,
          );
        } else {
          this.customLogger.error(
            `Failed to renew subscription for user ${user.id}`,
          );
        }
      } catch (error) {
        this.customLogger.error(
          `Error renewing subscription for user ${user.id}: ${error}`,
        );
      }
    }
  }
}
