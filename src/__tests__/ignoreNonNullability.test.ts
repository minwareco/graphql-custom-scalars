import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';

import { schema, queryDocument } from './__fixtures__/ingoreNonNullability';

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
});
