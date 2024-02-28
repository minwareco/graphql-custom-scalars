import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateScalar, StartOfDateScalar } from '../util';

import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    object: MyObject
    sure: MyObject!
    list: [MyObject!]
    listMaybe: [MyObject]
    sureList: [MyObject]!
    reallySureList: [MyObject!]!
  }

  type MyObject {
    day: Date
    morning: StartOfDay!
    days: [Date]!
    sureDays: [Date!]!
    mornings: [StartOfDay!]!
    empty: [Date]!
    nested: MyObject
  }

  "represents a Date with time"
  scalar Date

  "represents a Date at the beginning of the UTC day"
  scalar StartOfDay
`;

const rawDay = '2018-02-03T12:13:14.000Z';
const rawDay2 = '2019-02-03T12:13:14.000Z';
const rawMorning = '2018-02-03T00:00:00.000Z';
const rawMorning2 = '2019-02-03T00:00:00.000Z';

const parsedDay = new Date(rawDay);
const parsedDay2 = new Date(rawDay2);
const parsedMorning = new Date(rawMorning);
const parsedMorning2 = new Date(rawMorning2);

const resolvers = {
  Query: {
    object: () => ({}),
    sure: () => ({ nested: {} }),
    list: () => [{}],
    listMaybe: () => [{}],
    sureList: () => [{}],
    reallySureList: () => [{}],
  },
  MyObject: {
    day: () => parsedDay,
    morning: () => parsedMorning,
    days: () => [parsedDay, parsedDay2],
    sureDays: () => [parsedDay, parsedDay2],
    mornings: () => [parsedMorning, parsedMorning2],
    empty: () => [],
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
    object {
      ...MyObjectFragment
    }
    sure {
      ...MyObjectFragment
      nested {
        ...MyObjectFragment
      }
    }
    list {
      ...MyObjectFragment
    }
    listMaybe {
      ...MyObjectFragment
    }
    sureList {
      ...MyObjectFragment
    }
    reallySureList {
      ...MyObjectFragment
    }
  }

  fragment MyObjectFragment on MyObject {
    __typename
    day
    morning
    days
    sureDays
    mornings
    myMornings: mornings
    empty
  }
`;
