import { makeExecutableSchema } from '@graphql-tools/schema';
import { CustomDate, DateScalar, StartOfDateScalar } from '../util';
import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    "returns a Date object with time"
    convertToMorning(date: Date!): StartOfDay!
    convertToDay(date: StartOfDay!): Date!
    convertToDays(dates: [StartOfDay!]!): [Date!]!
  }

  "represents a Date with time"
  scalar Date

  "represents a Date at the beginning of the UTC day"
  scalar StartOfDay
`;

const resolvers = {
  Query: {
    convertToMorning: (_root: any, { date }: { date: Date }) => {
      const d = new Date(date);
      d.setUTCHours(0);
      d.setUTCMinutes(0);
      d.setUTCSeconds(0);
      d.setUTCMilliseconds(0);
      return new CustomDate(d.toISOString());
    },
    convertToDay: (_root: any, { date }: { date: CustomDate }) => {
      const d = date.getNewDate();
      d.setUTCHours(12);
      d.setUTCMinutes(13);
      d.setUTCSeconds(14);
      d.setUTCMilliseconds(0);
      return new Date(d.toISOString());
    },
    convertToDays: (_root: any, { dates }: { dates: CustomDate[] }) => {
      return dates.map((date) => {
        const d = date.getNewDate();
        d.setUTCHours(12);
        d.setUTCMinutes(13);
        d.setUTCSeconds(14);
        d.setUTCMilliseconds(0);
        return new Date(d.toISOString());
      });
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
  query MyQuery($morning: StartOfDay!, $mornings: [StartOfDay!]!, $day: Date!) {
    convertToMorning(date: $day)
    convertToDay(date: $morning)
    convertToDays(dates: $mornings)
  }
`;
