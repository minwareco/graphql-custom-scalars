import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';
import urqlScalarExchange from '../urqlScalarExchange';
import { schema, scalars, queryDocument } from './__fixtures__/inlineFragment';
import { executeExchange } from '@urql/exchange-execute';
import { createClient, cacheExchange } from '@urql/core';

describe('inline fragment with scalars', () => {
  describe('apollo', () => {
    it('maps results without custom scalars', async () => {
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
      const result = await client.query({ query: queryDocument });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "someField": {
            "__typename": "SomeField",
            "fieldA1": "2018-02-03T00:00:00.000Z",
            "fieldA2": "2018-02-03T12:13:14.000Z",
            "fieldA3": "2018-02-03T00:00:00.000Z",
            "subFieldB": {
              "__typename": "SomeFieldB",
              "fieldB1": "2018-02-03T00:00:00.000Z",
              "fieldB2": "2018-02-03T12:13:14.000Z",
              "fieldB3": "2018-02-03T00:00:00.000Z",
            },
          },
        }
      `);
    });

    it('maps results with custom scalars', async () => {
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
      const result = await client.query({ query: queryDocument });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "someField": {
            "__typename": "SomeField",
            "fieldA1": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            "fieldA2": "2018-02-03T12:13:14.000Z",
            "fieldA3": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            "subFieldB": {
              "__typename": "SomeFieldB",
              "fieldB1": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
              "fieldB2": "2018-02-03T12:13:14.000Z",
              "fieldB3": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
            },
          },
        }
      `);
    });
  });

  describe('urql', () => {
    it('maps results without custom scalars', async () => {
      const exchange = urqlScalarExchange({ schema });
      const executableExchange = executeExchange({ schema });
      const client = createClient({
        url: 'http://0.0.0.0',
        exchanges: [cacheExchange, exchange, executableExchange],
      });
      const result = await client.query(queryDocument, undefined).toPromise();
      expect(result.data).toMatchInlineSnapshot(`
        {
          "someField": {
            "__typename": "SomeField",
            "fieldA1": "2018-02-03T00:00:00.000Z",
            "fieldA2": "2018-02-03T12:13:14.000Z",
            "fieldA3": "2018-02-03T00:00:00.000Z",
            "subFieldB": {
              "__typename": "SomeFieldB",
              "fieldB1": "2018-02-03T00:00:00.000Z",
              "fieldB2": "2018-02-03T12:13:14.000Z",
              "fieldB3": "2018-02-03T00:00:00.000Z",
            },
          },
        }
      `);
    });

    it('maps results with custom scalars', async () => {
      const exchange = urqlScalarExchange({ schema, scalars });
      const executableExchange = executeExchange({ schema });
      const client = createClient({
        url: 'http://0.0.0.0',
        exchanges: [cacheExchange, exchange, executableExchange],
      });
      const result = await client.query(queryDocument, undefined).toPromise();
      expect(result.data).toMatchInlineSnapshot(`
        {
          "someField": {
            "__typename": "SomeField",
            "fieldA1": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            "fieldA2": "2018-02-03T12:13:14.000Z",
            "fieldA3": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            "subFieldB": {
              "__typename": "SomeFieldB",
              "fieldB1": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
              "fieldB2": "2018-02-03T12:13:14.000Z",
              "fieldB3": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
            },
          },
        }
      `);
    });
  });
});
