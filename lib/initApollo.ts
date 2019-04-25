import ApolloClient, { InMemoryCache } from "apollo-boost";

function createApolloClient({ getToken }, initialState): AppApolloClient {
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache().restore(initialState),
    request: async operation => {
      const token = getToken();
      const headers = {};
      if (token) {
        headers["authorization"] = token;
      }
      operation.setContext({
        headers
      });
    }
  });
}

type InitApolloOptions = {
  getToken(): String;
};

let apolloClient: AppApolloClient = null;

export default function initApollo(
  options: InitApolloOptions,
  initialState = {}
): AppApolloClient {
  if (!process.browser) {
    return createApolloClient(options, initialState);
  }

  // If in the browser, reuse the existing client
  if (!apolloClient) {
    apolloClient = createApolloClient(options, initialState);
  }
  return apolloClient;
}
