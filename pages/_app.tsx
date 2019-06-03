import "../styles/styles.scss";
import App, { Container, DefaultAppIProps } from "next/app";
import React from "react";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import gql from "graphql-tag";
import redirect from "../lib/redirect";
import cookie from "cookie";
import initApolloClient from "../lib/initApollo";
import Head from "next/head";
import { CurrentUser } from "./types/CurrentUser";
import Header from "../components/Header/Header";

function parseCookies(req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}

const GET_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
      name
    }
  }
`;

interface MyAppProps extends DefaultAppIProps {
  apollo: any;
  apolloState: any;
}

const unauthpages = ["/register", "/login"];

class MyApp extends App<MyAppProps> {
  private apolloClient;

  static async getInitialProps({ router, Component, ctx }) {
    let pageProps = {};

    let appClient = process.browser
      ? initApolloClient({
          getToken: () => parseCookies(null, {}).token
        })
      : initApolloClient({
          getToken: () => parseCookies(ctx.req).token
        });

    ctx.apolloClient = appClient;

    const getCurrentUser = await appClient.query<CurrentUser>({
      query: GET_USER
    });
    const user = getCurrentUser.data.currentUser;

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

    if (!process.browser) {
      // Run all graphql queries in the component tree
      // and extract the resulting data
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <ApolloProvider client={appClient}>
            <App pageProps={pageProps} Component={Component} router={router} />
          </ApolloProvider>
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error);
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();
    }

    // Extract query data from the Apollo's store
    const apolloState = appClient.cache.extract();

    return { pageProps, apolloState };
  }

  constructor(props) {
    super(props);
    this.apolloClient = initApolloClient(
      {
        getToken: () => parseCookies(null, {}).token
      },
      props.apolloState
    );
  }

  render() {
    const { Component, pageProps } = this.props;
    return [
      <Header />,
      <ApolloProvider client={this.apolloClient}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ApolloProvider>
    ];
  }
}

export default MyApp;
