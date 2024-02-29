import { makeExecutableSchema } from '@graphql-tools/schema';
import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    day: String
  }
`;

export const schema = makeExecutableSchema({ typeDefs });

export const queryDocument = gql`
  query MyQuery {
    day
  }
`;
