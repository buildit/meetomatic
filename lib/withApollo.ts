import withApollo from "next-with-apollo";
import ApolloClient, { InMemoryCache } from "apollo-boost";

export default withApollo(({ initialState }) => {
  // console.log("create client", ctx, headers, initialState);
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache().restore(initialState || {})
  });
});
