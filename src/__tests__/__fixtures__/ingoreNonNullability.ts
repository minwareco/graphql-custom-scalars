import { makeExecutableSchema } from '@graphql-tools/schema';

import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    item: Item!
  }

  type Item {
    title: String
    subItem: Item!
  }
`;

const resolvers = {
  Query: {
    item: () => ({}),
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const queryDocument = gql`
  query MyQuery($skip: Boolean!) {
    item1: item @skip(if: $skip) {
      title
    }
    item2: item {
      title
      subItem @skip(if: $skip) {
        title
      }
    }
  }
`;
