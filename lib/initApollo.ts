import ApolloClient, { InMemoryCache } from "apollo-boost";

export type AppApolloClient = ApolloClient<InMemoryCache>;

function createApolloClient({ getToken }): AppApolloClient {
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
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
  options: InitApolloOptions
): AppApolloClient {
  if (!process.browser) {
    return createApolloClient(options);
  }

  // If in the browser, reuse the existing client
  if (!apolloClient) {
    apolloClient = createApolloClient(options);
  }
  return apolloClient;
}