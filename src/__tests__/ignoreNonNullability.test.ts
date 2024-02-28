import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';
import urqlScalarExchange from '../urqlScalarExchange';
import { schema, queryDocument } from './__fixtures__/ingoreNonNullability';
import { executeExchange } from '@urql/exchange-execute';
import { createClient, cacheExchange } from '@urql/core';

describe('ignore non nullability', () => {
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

    it('disregards field type non-nullability', async () => {
      const result = await client.query({
        query: queryDocument,
        variables: { skip: true },
      });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "item2": {
            "__typename": "Item",
            "title": null,
          },
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

    it('disregards field type non-nullability', async () => {
      const result = await client
        .query(queryDocument, { skip: true })
        .toPromise();
      expect(result.data).toMatchInlineSnapshot(`
        {
          "item2": {
            "__typename": "Item",
            "title": null,
          },
        }
      `);
    });
  });
});
