import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { userId } = ctx.getContext().req

    return userId
  }
);

export const GetCurrentUserRest = createParamDecorator(
  (data, context: ExecutionContext) => {
    const { userId } = context.switchToHttp().getRequest();

    return userId;
  }
)