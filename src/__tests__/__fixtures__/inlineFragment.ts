import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateScalar, StartOfDateScalar } from '../util';
import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    someField: SomeField
  }

  type SomeField {
    fieldA1: StartOfDay
    fieldA2: Date
    fieldA3: StartOfDay
    subFieldB: SomeFieldB
  }

  type SomeFieldB {
    fieldB1: StartOfDay
    fieldB2: Date
    fieldB3: StartOfDay
  }

  "represents a Date with time"
  scalar Date

  "represents a Date with time at the start of the day UTC"
  scalar StartOfDay
`;

const rawDay = '2018-02-03T12:13:14.000Z';
const rawMorning = '2018-02-03T00:00:00.000Z';

const parsedDay = new Date(rawDay);
const parsedMorning = new Date(rawMorning);

const resolvers = {
  Query: {
    someField: () => ({}),
  },
  SomeField: {
    fieldA1: () => parsedMorning,
    fieldA2: () => parsedDay,
    fieldA3: () => parsedMorning,
    subFieldB: () => ({}),
  },
  SomeFieldB: {
    fieldB1: () => parsedMorning,
    fieldB2: () => parsedDay,
    fieldB3: () => parsedMorning,
  },
  Date: DateScalar,
  StartOfDay: StartOfDateScalar,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const queryDocument = gql`
  query MyQuery {
    someField {
      __typename
      ...FragmentA
      subFieldB {
        __typename
        ...FragmentB
      }
    }
  }

  fragment FragmentA on SomeField {
    fieldA1
    fieldA2
    fieldA3
    subFieldB {
      fieldB2
    }
  }

  fragment FragmentB on SomeFieldB {
    fieldB1
    fieldB2
    fieldB3
  }
`;

export const scalars = {
  StartOfDay: StartOfDateScalar,
};
