import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';
import urqlScalarExchange from '../urqlScalarExchange';
import { schema, scalars, queryDocument } from './__fixtures__/customScalar';
import { executeExchange } from '@urql/exchange-execute';
import { createClient, cacheExchange } from '@urql/core';

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

  describe('urql', () => {
    const exchange = urqlScalarExchange({ schema, scalars });
    const executableExchange = executeExchange({ schema });
    const client = createClient({
      url: 'http://0.0.0.0',
      exchanges: [cacheExchange, exchange, executableExchange],
    });

    it('maps results to custom scalars', async () => {
      const result = await client.query(queryDocument, undefined).toPromise();
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
