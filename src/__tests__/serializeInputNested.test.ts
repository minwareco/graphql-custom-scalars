import {
  ApolloClient,
  ApolloError,
  ApolloLink,
  InMemoryCache,
  isApolloError,
} from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { CustomDate, DateScalar, StartOfDateScalar } from './util';
import {
  schema,
  scalars,
  queryDocument,
} from './__fixtures__/serializeInputNested';
import { buildSchema, printSchema } from 'graphql';
import apolloScalarLink from '../apolloScalarLink';

const rawDay = '2018-02-03T12:13:14.000Z';
const rawMorning = '2018-02-03T00:00:00.000Z';

const parsedDay = new Date(rawDay);
const parsedMorning = new CustomDate(rawMorning);

const rawMorning2 = '2018-03-04T00:00:00.000Z';
const parsedMorning2 = new CustomDate(rawMorning2);

const schemaWithoutTypes = buildSchema(printSchema(schema));
describe('serializes input', () => {
  describe('apollo', () => {
    it('maps results without custom scalars should fail', async () => {
      const link = apolloScalarLink({
        schema: schemaWithoutTypes,
      });

      const executableLink = new SchemaLink({
        schema,
      });
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          link,
          new ApolloLink((operation, forward) => {
            expect(operation.variables).toEqual({
              input: {
                first: parsedDay,
                second: {
                  morning: parsedMorning,
                  list: [parsedMorning, parsedMorning2],
                },
              },
            });
            operation.variables = JSON.parse(
              JSON.stringify(operation.variables)
            );
            return forward(operation);
          }),
          executableLink,
        ]),
      });
      try {
        jest.spyOn(DateScalar, 'parseValue');
        jest.spyOn(StartOfDateScalar, 'parseValue');
        await client.query({
          query: queryDocument,
          variables: {
            input: {
              first: parsedDay,
              second: {
                morning: parsedMorning,
                list: [parsedMorning, parsedMorning2],
              },
            },
          },
        });
        expect(true).toBe(false);
      } catch (e: any) {
        expect(isApolloError(e)).toBe(true);
        expect((e as ApolloError).graphQLErrors[0].message).toContain(
          'Variable "$input" got invalid value'
        );
      }
    });

    it('maps results with custom scalars', async () => {
      const link = apolloScalarLink({
        schema: schemaWithoutTypes,
        scalars,
      });

      const executableLink = new SchemaLink({
        schema,
      });
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          link,
          new ApolloLink((operation, forward) => {
            expect(operation.variables).toEqual({
              input: {
                first: rawDay,
                second: {
                  morning: rawMorning,
                  list: [rawMorning, rawMorning2],
                },
              },
            });
            operation.variables = JSON.parse(
              JSON.stringify(operation.variables)
            );
            return forward(operation);
          }),
          executableLink,
        ]),
      });
      const result = await client.query({
        query: queryDocument,
        variables: {
          input: {
            first: parsedDay,
            second: {
              morning: parsedMorning,
              list: [parsedMorning, parsedMorning2],
            },
          },
        },
      });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "convert": {
            "__typename": "MyResponse",
            "first": CustomDate {
              "internalDate": 2018-02-03T00:00:00.000Z,
            },
            "nested": {
              "__typename": "MyNestedResponse",
              "days": [
                2018-02-03T12:13:14.000Z,
                2018-03-04T12:13:14.000Z,
              ],
              "nestedDay": 2018-02-03T12:13:14.000Z,
            },
          },
        }
      `);
    });
  });
});
