import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';
import urqlScalarExchange from '../urqlScalarExchange';
import { schema, queryDocument } from './__fixtures__/builtInScalars';
import { executeExchange } from '@urql/exchange-execute';
import { createClient, cacheExchange } from '@urql/core';

describe('built in scalars', () => {
  describe('apollo', () => {
    const link = apolloScalarLink({
      schema,
    });

    const executableLink = new SchemaLink({
      schema,
    });
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([link, executableLink]),
    });

    it('parses null values for nullable leaf types', async () => {
      const result = await client.query({ query: queryDocument });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "day": null,
        }
      `);
    });
  });

  describe('urql', () => {
    const exchange = urqlScalarExchange({ schema });
    const executableExchange = executeExchange({ schema });
    const client = createClient({
      url: 'http://0.0.0.0',
      exchanges: [cacheExchange, exchange, executableExchange],
    });

    it('parses null values for nullable leaf types', async () => {
      const result = await client.query(queryDocument, undefined).toPromise();
      expect(result.data).toMatchInlineSnapshot(`
        {
          "day": null,
        }
      `);
    });
  });
});
