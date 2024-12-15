import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUserContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // Return the userId from the request object
    return request.user?.id;
  },
);
