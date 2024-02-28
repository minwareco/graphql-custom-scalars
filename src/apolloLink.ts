import {
  GraphQLScalarType,
  GraphQLSchema,
  IntrospectionQuery,
  buildClientSchema,
} from 'graphql';
import { customScalarResolver } from './core';
import { ApolloLink } from '@apollo/client';
interface ScalarLinkOptions {
  scalars: Record<string, Pick<GraphQLScalarType<any, any>, 'parseValue'>>;
  schema: GraphQLSchema | IntrospectionQuery;
}

export default function scalarLink({ schema, scalars }: ScalarLinkOptions) {
  const clientSchema =
    '__schema' in schema ? buildClientSchema(schema) : schema;
  const resolver = customScalarResolver({ schema: clientSchema, scalars });
  return new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => resolver(operation, data));
  });
}
