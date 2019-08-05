import { PubSub, gql } from 'apollo-server';
import { filter } from 'lodash';
const pubsub = new PubSub();

const FV_CREATED = 'FV_CREATED';
let id = 2;
const results = [
  { id: 0, fairValue: Math.random() },
  { id: 1, fairValue: Math.random() },
];

module.exports = {
  Query: {
    results: (root, args) => {
      if (typeof args.id !== 'undefined')
        return filter(results, { id: args.id });
      else return results;
    },
  },
  Subscription: {
    resultCreated: {
      subscribe: () => pubsub.asyncIterator(FV_CREATED),
    },
  },
  Mutation: {
    addResult: (root, args) => {
      const newResult = { id: id++, fairValue: Math.random() };
      // time out before mutate result
      setTimeout(function() {
        results.push(newResult);
        pubsub.publish(FV_CREATED, { resultCreated: newResult });
        return newResult;
      }, 15 * 60 * 1000);
    },
  },
};

// setInterval(() => {
//   pubsub.publish(FV_CREATED, {
//     resultCreated: { id, fairValue: Math.random() },
//   });

//   id++;
// }, 3000);
