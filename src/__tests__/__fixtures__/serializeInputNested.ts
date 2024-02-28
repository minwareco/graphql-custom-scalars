import { makeExecutableSchema } from '@graphql-tools/schema';
import { CustomDate, DateScalar, StartOfDateScalar } from '../util';
import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    convert(input: MyInput!): MyResponse!
  }

  input MyInput {
    first: Date!
    second: MyNested!
  }

  input MyNested {
    morning: StartOfDay!
    list: [StartOfDay!]!
  }

  type MyResponse {
    first: StartOfDay!
    nested: MyNestedResponse
  }

  type MyNestedResponse {
    nestedDay: Date!
    days: [Date!]!
  }

  "represents a Date with time"
  scalar Date

  "represents a Date at the beginning of the UTC day"
  scalar StartOfDay
`;

type MyInput = { first: Date; second: MyNested };
type MyNested = { morning: CustomDate; list: CustomDate[] };
type MyResponse = { first: CustomDate; nested: MyNestedResponse };
type MyNestedResponse = { nestedDay: CustomDate; days: CustomDate[] };

function toStartOfDay(givenDate: Date): CustomDate {
  const d = new Date(givenDate);
  d.setUTCHours(0);
  d.setUTCMinutes(0);
  d.setUTCSeconds(0);
  d.setUTCMilliseconds(0);
  return new CustomDate(d.toISOString());
}

function toDay(givenDate: CustomDate): CustomDate {
  const d = givenDate.getNewDate();
  d.setUTCHours(12);
  d.setUTCMinutes(13);
  d.setUTCSeconds(14);
  d.setUTCMilliseconds(0);
  return new CustomDate(d.toISOString());
}

const resolvers = {
  Query: {
    convert: (_root: any, { input }: { input: MyInput }): MyResponse => {
      return {
        first: toStartOfDay(input.first),
        nested: {
          nestedDay: toDay(input.second.morning),
          days: input.second.list.map(toDay),
        },
      };
    },
  },
  Date: DateScalar,
  StartOfDay: StartOfDateScalar,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const scalars = {
  StartOfDay: StartOfDateScalar,
  Date: DateScalar,
};

export const queryDocument = gql`
  query MyQuery($input: MyInput!) {
    convert(input: $input) {
      first
      nested {
        nestedDay
        days
      }
    }
  }
`;
