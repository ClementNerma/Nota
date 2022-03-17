import { ApolloClient, InMemoryCache } from '@apollo/client/core'

export default new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})
