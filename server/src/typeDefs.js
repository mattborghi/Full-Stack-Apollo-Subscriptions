import { gql } from 'apollo-server';

module.exports = gql`
  type Query {
    results(id: Int): [Result]
  }

  type Subscription {
    resultCreated: Result
  }

  type Mutation {
    addResult: Result
  }

  type Result {
    id: Int
    fairValue: Float
  }
`;