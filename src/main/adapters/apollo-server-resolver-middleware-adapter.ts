import { Middleware } from '@/presentation/protocols';
import { GraphQLError } from 'graphql';

export const adaptResolverMiddleware = async (
  middleware: Middleware,
  context: any
): Promise<any> => {
  const request = {
    accessToken: context?.req?.headers?.['x-access-token'],
  };
  const httpResponse = await middleware.handle(request);
  if (httpResponse.statusCode === 200) {
    Object.assign(context?.req, httpResponse.body);
  } else {
    throw new GraphQLError(httpResponse.body.message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
};
