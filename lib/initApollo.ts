import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from "apollo-link";

function createApolloClient(
  { getToken },
  initialState
): ApolloClient<NormalizedCacheObject> {
  const request = async operation => {
    const token = getToken();
    const headers = {};
    if (token) {
      headers["authorization"] = token;
    }
    operation.setContext({
      headers
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      requestLink,
      new HttpLink({
        uri: "http://localhost:4000",
        credentials: "same-origin"
      })
    ]),
    cache: new InMemoryCache().restore(initialState)
  });
}

type InitApolloOptions = {
  getToken(): String;
};

let apolloClient = null;

export default function initApollo(
  options: InitApolloOptions,
  initialState = {}
): ApolloClient<NormalizedCacheObject> {
  if (!process.browser) {
    return createApolloClient(options, initialState);
  }

  // If in the browser, reuse the existing client
  if (!apolloClient) {
    apolloClient = createApolloClient(options, initialState);
  }
  return apolloClient;
}
