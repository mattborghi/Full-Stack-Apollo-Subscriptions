import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_RESULTS = gql`
  {
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

const ADD_RESULT = gql`
  mutation {
    addResult {
      id
      fairValue
    }
  }
`;

function Results() {
  const { data, loading, subscribeToMore } = useQuery(GET_RESULTS);

  if (loading) return <span>Loading ...</span>;

  return (
    <>
      <GetResults />
      <DisplayResults
        results={data.results}
        subscribeToMore={subscribeToMore}
      />
    </>
  );
}

function App() {
  return <Results />;
}

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

function GetResults() {
  const [addResult, { data }] = useMutation(ADD_RESULT, {
    onCompleted: () => {
      console.log('Finished mutation');
    },
  });
  return (
    <input
      type="button"
      value="Get Result!"
      onClick={() => {
        addResult();
        console.log('Clicked!');
      }}
    />
  );
}

export default App;
