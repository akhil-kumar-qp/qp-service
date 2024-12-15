import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateSubscriptionDto } from 'src/modules/subscription/application/dto/update-subscription.dto';
import { SubscriptionService } from 'src/modules/subscription/domain/service/subscription.service';
import Stripe from 'stripe';

export class PaymentGateWayService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  private async makePaymentAndReturnId(
    userId: number,
    amount: number,
    cardInfo: UpdateSubscriptionDto,
  ) {
    try {
      // Simulate calling Stripe's payment intent API
      const paymentIntent = await Stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
        payment_intent_data: {
          card_number: cardInfo.cardNumber,
          cvv: cardInfo.cvv,
          expiry_date: cardInfo.month + '/' + cardInfo.year,
          name: cardInfo.name,
        },
        metadata: {
          userId,
        },
      });

      return paymentIntent.id;
    } catch (error) {
      if (error.type === 'StripeCardError') {
        throw new BadRequestException({
          message: 'Card error: ' + error.message,
          code: 'CARD_ERROR',
        });
      } else if (error.type === 'StripeInvalidRequestError') {
        throw new BadRequestException({
          message: 'Invalid request: ' + error.message,
          code: 'INVALID_REQUEST_ERROR',
        });
      } else if (error.type === 'StripeAPIError') {
        throw new InternalServerErrorException({
          message: 'Stripe API error: ' + error.message,
          code: 'STRIPE_API_ERROR',
        });
      } else if (error.type === 'StripeConnectionError') {
        throw new InternalServerErrorException({
          message: 'Connection error with Stripe: ' + error.message,
          code: 'STRIPE_CONNECTION_ERROR',
        });
      }

      // Generic server error
      throw new InternalServerErrorException({
        message: 'Internal server error: ' + error.message,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async purchaseSubscription(
    userId: number,
    planData: any,
    cardInfo: UpdateSubscriptionDto,
  ) {
    const amount = planData.price;

    try {
      // Attempt to make the payment
      const paymentId = await this.makePaymentAndReturnId(
        userId,
        amount,
        cardInfo,
      );

      if (!paymentId) {
        throw new BadRequestException({
          message: 'Payment failed: Unable to retrieve payment ID.',
          code: 'PAYMENT_FAILED',
        });
      }

      // Create user payment after successful payment
      await this.subscriptionService.createUserPayment(
        userId,
        cardInfo.planId,
        paymentId,
      );

      return {
        message: 'Payment request successful.',
        paymentId,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message:
          'An error occurred while processing the subscription purchase.',
        code: 'PURCHASE_FAILED',
      });
    }
  }

  async getPaymentGatewayToken(userId: number): Promise<string> {
    const token = await Stripe.paymentIntents.generateToken({
      customer: userId,
      uuid: randomUUID(),
    });

    return token;
  }
}
