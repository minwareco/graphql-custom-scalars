import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import apolloScalarLink from '../apolloScalarLink';

import { schema, scalars, queryDocument } from './__fixtures__/scalarsObject';

describe('scalars in object', () => {
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
          "list": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": "2018-02-03T00:00:00.000Z",
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
            },
          ],
          "listMaybe": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": "2018-02-03T00:00:00.000Z",
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
            },
          ],
          "object": {
            "__typename": "MyObject",
            "day": "2018-02-03T12:13:14.000Z",
            "days": [
              "2018-02-03T12:13:14.000Z",
              "2019-02-03T12:13:14.000Z",
            ],
            "empty": [],
            "morning": "2018-02-03T00:00:00.000Z",
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
          },
          "reallySureList": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": "2018-02-03T00:00:00.000Z",
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
            },
          ],
          "sure": {
            "__typename": "MyObject",
            "day": "2018-02-03T12:13:14.000Z",
            "days": [
              "2018-02-03T12:13:14.000Z",
              "2019-02-03T12:13:14.000Z",
            ],
            "empty": [],
            "morning": "2018-02-03T00:00:00.000Z",
            "mornings": [
              "2018-02-03T00:00:00.000Z",
              "2019-02-03T00:00:00.000Z",
            ],
            "myMornings": [
              "2018-02-03T00:00:00.000Z",
              "2019-02-03T00:00:00.000Z",
            ],
            "nested": {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": "2018-02-03T00:00:00.000Z",
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
            },
            "sureDays": [
              "2018-02-03T12:13:14.000Z",
              "2019-02-03T12:13:14.000Z",
            ],
          },
          "sureList": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": "2018-02-03T00:00:00.000Z",
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
            },
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
          "list": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
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
            },
          ],
          "listMaybe": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
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
            },
          ],
          "object": {
            "__typename": "MyObject",
            "day": "2018-02-03T12:13:14.000Z",
            "days": [
              "2018-02-03T12:13:14.000Z",
              "2019-02-03T12:13:14.000Z",
            ],
            "empty": [],
            "morning": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
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
          },
          "reallySureList": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
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
            },
          ],
          "sure": {
            "__typename": "MyObject",
            "day": "2018-02-03T12:13:14.000Z",
            "days": [
              "2018-02-03T12:13:14.000Z",
              "2019-02-03T12:13:14.000Z",
            ],
            "empty": [],
            "morning": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
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
            "nested": {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
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
            },
            "sureDays": [
              "2018-02-03T12:13:14.000Z",
              "2019-02-03T12:13:14.000Z",
            ],
          },
          "sureList": [
            {
              "__typename": "MyObject",
              "day": "2018-02-03T12:13:14.000Z",
              "days": [
                "2018-02-03T12:13:14.000Z",
                "2019-02-03T12:13:14.000Z",
              ],
              "empty": [],
              "morning": CustomDate {
                "internalDate": 2018-02-03T00:00:00.000Z,
              },
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
            },
          ],
        }
      `);
    });
  });
});
