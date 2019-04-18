import "../styles.scss";
import App, { Container, DefaultAppIProps } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { gql } from "apollo-boost";
import redirect from "../lib/redirect";
import cookie from "cookie";
import initApolloClient from "../lib/initApollo";

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}

const GET_USER = gql`
  {
    getCurrentUser {
      id
      email
      name
    }
  }
`;

interface MyAppProps extends DefaultAppIProps {
  apollo: any;
}

const unauthpages = ["/register", "/login"];

class MyApp extends App<MyAppProps> {
  private apolloClient: any = null;

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    let appClient: AppApolloClient;

    if (process.browser) {
      appClient = initApolloClient({
        getToken: () => parseCookies(null, {}).token
      });
    } else {
      appClient = initApolloClient({
        getToken: () => parseCookies(ctx.req).token
      });
    }

    ctx.apolloClient = appClient;

    const getCurrentUser = await ctx.apolloClient.query({ query: GET_USER });
    const user = getCurrentUser.data.getCurrentUser;

    if (!user) {
      if (!unauthpages.includes(ctx.pathname)) {
        redirect(ctx, "/login");
      }
    } else {
      if (unauthpages.includes(ctx.pathname)) {
        redirect(ctx);
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.apolloClient = initApolloClient({
      getToken: () => parseCookies(null, {}).token
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
