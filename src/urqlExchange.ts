import {
  GraphQLScalarType,
  GraphQLSchema,
  IntrospectionQuery,
  buildClientSchema,
} from 'graphql';
import { customScalarResolver } from './core';
import { map, pipe } from 'wonka';
import { Exchange } from '@urql/core';

interface ScalarExchangeOptions {
  scalars: Record<string, Pick<GraphQLScalarType<any, any>, 'parseValue'>>;
  schema: GraphQLSchema | IntrospectionQuery;
}

export default function scalarExchange({
  schema,
  scalars,
}: ScalarExchangeOptions): Exchange {
  const clientSchema =
    '__schema' in schema ? buildClientSchema(schema) : schema;

  const resolver = customScalarResolver({ schema: clientSchema, scalars });

  return ({ forward }) =>
    (operations$) => {
      const operationResult$ = forward(operations$);
      return pipe(
        operationResult$,
        map((args) => resolver(args.operation, args))
      );
    };
}
