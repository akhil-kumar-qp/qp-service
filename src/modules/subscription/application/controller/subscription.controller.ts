import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from '../../domain/service/subscription.service';
import { response } from 'express';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { getUserContext } from 'src/common-lib/decorators/get-user-context.decorator';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('/update')
  async updateSubscription(
    @getUserContext() userId: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    await this.subscriptionService.updateSubscription(
      userId,
      updateSubscriptionDto,
    );
    response
      .status(200)
      .json({ message: 'Subscription upgrated successfully' });
  }
}
