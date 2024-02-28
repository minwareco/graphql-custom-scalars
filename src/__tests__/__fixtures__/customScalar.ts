import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateScalar, StartOfDateScalar } from '../util';
import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    "returns a Date object with time"
    day: Date!

    "returns a Date object with time set at the beginning of the UTC day"
    morning: StartOfDay
  }

  "represents a Date with time"
  scalar Date

  "represents a Date at the beginning of the UTC day"
  scalar StartOfDay
`;

const rawDay = '2018-02-03T12:13:14.000Z';
const rawMorning = '2018-02-03T00:00:00.000Z';

const parsedDay = new Date(rawDay);
const parsedMorning = new Date(rawMorning);

const resolvers = {
  Query: {
    day: () => parsedDay,
    morning: () => parsedMorning,
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
};

export const queryDocument = gql`
  query MyQuery {
    day
    morning
    someDay: day
    someMorning: morning
  }
`;
