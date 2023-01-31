import { makeAuthMiddleware } from '@/main/factories';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema } from 'graphql';

export const authDirectiveTransformer = (
  schema: GraphQLSchema
): GraphQLSchema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const authDirective = getDirective(schema, fieldConfig, 'auth');
      if (authDirective) {
        const { resolve } = fieldConfig;
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            accessToken: context?.req?.headers?.['x-access-token'],
          };
          const httpResponse = await makeAuthMiddleware().handle(request);
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body);
            return resolve(parent, args, context, info);
          } else {
            throw new GraphQLError(httpResponse.body.message, {
              extensions: {
                code: 'FORBIDDEN',
              },
            });
          }
        };
      }
      return fieldConfig;
    },
  });
