import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { schema, scalars, queryDocument } from './__fixtures__/scalarsArray';
import { executeExchange } from '@urql/exchange-execute';
import { createClient, cacheExchange } from '@urql/core';
import apolloScalarLink from '../apolloScalarLink';
import urqlScalarExchange from '../urqlScalarExchange';

describe('scalars in array', () => {
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
          "days": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
          "empty": [],
          "mornings": [
            "2018-02-03T00:00:00.000Z",
            "2019-02-03T00:00:00.000Z",
          ],
          "myMornings": [
            "2018-02-03T00:00:00.000Z",
            "2019-02-03T00:00:00.000Z",
          ],
          "sureDays": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
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
          "days": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
          "empty": [],
          "mornings": [
            CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            CustomDate {
              "internalDate": 2019-02-03T00:00:00.000Z,
            },
          ],
          "myMornings": [
            CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            CustomDate {
              "internalDate": 2019-02-03T00:00:00.000Z,
            },
          ],
          "sureDays": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
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
          "days": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
          "empty": [],
          "mornings": [
            "2018-02-03T00:00:00.000Z",
            "2019-02-03T00:00:00.000Z",
          ],
          "myMornings": [
            "2018-02-03T00:00:00.000Z",
            "2019-02-03T00:00:00.000Z",
          ],
          "sureDays": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
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
          "days": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
          "empty": [],
          "mornings": [
            CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            CustomDate {
              "internalDate": 2019-02-03T00:00:00.000Z,
            },
          ],
          "myMornings": [
            CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            CustomDate {
              "internalDate": 2019-02-03T00:00:00.000Z,
            },
          ],
          "sureDays": [
            "2018-02-03T12:13:14.000Z",
            "2019-02-03T12:13:14.000Z",
          ],
        }
      `);
    });
  });
});
