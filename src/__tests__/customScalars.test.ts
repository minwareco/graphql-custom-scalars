import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';

import { schema, scalars, queryDocument } from './__fixtures__/customScalar';

describe('custom scalars', () => {
  describe('apollo', () => {
    const link = apolloScalarLink({
      schema,
      scalars,
    });

    const executableLink = new SchemaLink({
      schema,
    });
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([link, executableLink]),
    });

    it('maps results to custom scalars', async () => {
      const result = await client.query({ query: queryDocument });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "day": "2018-02-03T12:13:14.000Z",
          "morning": CustomDate {
            "internalDate": 2018-02-03T00:00:00.000Z,
          },
          "someDay": "2018-02-03T12:13:14.000Z",
          "someMorning": CustomDate {
            "internalDate": 2018-02-03T00:00:00.000Z,
          },
        }
      `);
    });
  });
});
