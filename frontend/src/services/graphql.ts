import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql/';

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Token ${token}` } : {};
  },
});



