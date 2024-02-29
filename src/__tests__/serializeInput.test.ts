import {
  ApolloClient,
  ApolloError,
  ApolloLink,
  InMemoryCache,
  isApolloError,
} from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { CustomDate, DateScalar, StartOfDateScalar } from './util';
import apolloScalarLink from '../apolloScalarLink';

import { schema, scalars, queryDocument } from './__fixtures__/serializeInput';
import { buildSchema, printSchema } from 'graphql';

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
              day: parsedDay,
              morning: parsedMorning,
              mornings: [parsedMorning, parsedMorning2],
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
            day: parsedDay,
            morning: parsedMorning,
            mornings: [parsedMorning, parsedMorning2],
          },
        });
        expect(true).toBe(false);
      } catch (e: any) {
        expect(isApolloError(e)).toBe(true);
        expect((e as ApolloError).graphQLErrors[0].message).toContain(
          'Variable "$morning" got invalid value'
        );
        expect((e as ApolloError).graphQLErrors[1].message).toContain(
          'Variable "$mornings" got invalid value'
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
              day: rawDay,
              morning: rawMorning,
              mornings: [rawMorning, rawMorning2],
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
          day: parsedDay,
          morning: parsedMorning,
          mornings: [parsedMorning, parsedMorning2],
        },
      });
      expect(result.data).toMatchInlineSnapshot(`
        {
          "convertToDay": 2018-02-03T12:13:14.000Z,
          "convertToDays": [
            2018-02-03T12:13:14.000Z,
            2018-03-04T12:13:14.000Z,
          ],
          "convertToMorning": CustomDate {
            "internalDate": 2018-02-03T00:00:00.000Z,
          },
        }
      `);
    });
  });
});
