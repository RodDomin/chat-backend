import { GqlExceptionFilter, GqlArgumentsHost } from "@nestjs/graphql";
import { Catch, HttpException, ArgumentsHost } from "@nestjs/common";

@Catch(HttpException)
export class UserFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    return exception;
  }
}