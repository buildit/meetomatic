import withApollo from "next-with-apollo";

export default withApollo(({ ctx, initialState }) => {
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache().restore(initialState || {}),
    request: async operation => {
      const token = parseCookies(ctx && ctx.req).token;
      const headers = {};
      if (token) {
        headers["authorization"] = token;
      }
      operation.setContext({
        headers
      });
    }
  });
});
