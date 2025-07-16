import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const { userId: restUserId } = context.switchToHttp().getRequest();
    const { userId: graphqlUserId } = ctx.getContext().req;

    return graphqlUserId ?? restUserId;
  }
);
