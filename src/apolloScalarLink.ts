import { ApolloLink } from '@apollo/client';
import { GraphQLSchema, GraphQLScalarType } from 'graphql';
import { CustomScalarResolver } from './core';

export default function apolloapolloScalarLink({
  schema,
  scalars,
}: {
  schema: GraphQLSchema;
  scalars?: Record<string, GraphQLScalarType<any, any>>;
}) {
  const resolver = new CustomScalarResolver(schema, scalars);
  return new ApolloLink((operation, forward) => {
    return forward(resolver.mapVariables(operation)).map((data) =>
      resolver.mapResults(operation, data)
    );
  });
}
