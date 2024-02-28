import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';

import { schema, queryDocument } from './__fixtures__/builtInScalars';

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
});
