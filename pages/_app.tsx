import App, { Container, DefaultAppIProps } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import withApollo from "../lib/withApollo";
import { gql } from "apollo-boost";
import redirect from "../lib/redirect";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import cookie from "cookie";

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}

// Global apollo client used by the browser
let apolloClient;
const GET_USER = gql`
  {
    getCurrentUser {
      id
      email
      name
    }
  }
`;

function createApolloClient({ getToken }) {
  return new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
    request: async operation => {
      const token = getToken();
      const headers = {};
      if (token) {
        console.log("token: ", token);
        headers["authorization"] = token;
      }
      operation.setContext({
        headers
      });
    }
  });
}
interface MyAppProps extends DefaultAppIProps {
  apollo: any;
}

const unauthpages = ["/register", "/login"];

class MyApp extends App<MyAppProps> {
  private apolloClient: any = null;

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    let appClient;
    if (process.browser) {
      if (!apolloClient) {
        apolloClient = createApolloClient({
          getToken: () => parseCookies(null, {}).token
        });
      }
      appClient = apolloClient;
    } else {
      appClient = createApolloClient({
        getToken: () => parseCookies(ctx.req).token
      });
    }

    ctx.apolloClient = appClient;

    const getCurrentUser = await ctx.apolloClient.query({ query: GET_USER });
    const user = getCurrentUser.data.getCurrentUser;

    if (!user) {
      if (!unauthpages.includes(ctx.pathname)) {
        redirect(ctx, "/register");
      }
    } else {
      if (unauthpages.includes(ctx.pathname)) {
        redirect(ctx, "/");
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.apolloClient = createApolloClient({
      getToken: () => parseCookies(null, {})
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ApolloProvider client={this.apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default MyApp;
