import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_RESULTS = gql`
  query {
    results {
      id
      fairValue
    }
  }
`;

const RESULTS_CREATED = gql`
  subscription {
    resultCreated {
      id
      fairValue
    }
  }
`;

const App = () => (
  <Query query={GET_RESULTS}>
    {({ data, loading, subscribeToMore }) => {
      if (!data) {
        return null;
      }

      if (loading) {
        return <span>Loading ...</span>;
      }

      return (
        <DisplayResults
          results={data.results}
          subscribeToMore={subscribeToMore}
        />
      );
    }}
  </Query>
);

class DisplayResults extends React.Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: RESULTS_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        return {
          results: [
            ...prev.results,
            subscriptionData.data.resultCreated,
          ],
        };
      },
    });
  }

  render() {
    return (
      <ul>
        {this.props.results.map(result => (
          <li key={result.id}>{result.fairValue}</li>
        ))}
      </ul>
    );
  }
}

export default App;
