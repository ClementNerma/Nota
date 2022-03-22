import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { get } from 'svelte/store'
import { APOLLO_CONTEXT_ACCESS_TOKEN, authData } from './others/auth'

export const API_SERVER_URL = 'http://localhost:4000/graphql'

const httpLink = createHttpLink({
  uri: API_SERVER_URL,
})

const authLink = setContext((_, ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const token = ctx[APOLLO_CONTEXT_ACCESS_TOKEN] ?? get(authData)?.accessToken
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const header = token !== undefined ? `Bearer ${token}` : ''

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...ctx.headers,
      authorization: header,
    },
  }
})

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
