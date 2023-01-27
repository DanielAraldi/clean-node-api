import { Controller } from '@/presentation/protocols';
import { GraphQLError } from 'graphql';

export const adaptResolver = async (
  controller: Controller,
  args?: any
): Promise<any> => {
  const request = { ...(args || {}) };
  const httpResponse = await controller.handle(request);
  switch (httpResponse.statusCode) {
    case 200:
    case 204:
      return httpResponse.body;
    case 400:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: {
          code: 'BAD_REQUEST',
        },
      });
    case 401:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    case 403:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    default:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
  }
};
