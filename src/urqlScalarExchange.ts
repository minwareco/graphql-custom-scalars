import { Exchange, mapExchange } from '@urql/core';
import { CustomScalarResolver } from './core';
import { GraphQLSchema, GraphQLScalarType } from 'graphql';

export default function urqlurqlScalarExchange({
  schema,
  scalars,
}: {
  schema: GraphQLSchema;
  scalars?: Record<string, GraphQLScalarType<any, any>>;
}): Exchange {
  const resolver = new CustomScalarResolver(schema, scalars);

  return mapExchange({
    onOperation: (operation) => resolver.mapVariables(operation),
    onResult: (args) => resolver.mapResults(args.operation, args),
  });
}
