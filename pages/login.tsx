import React from "react";
import { gql } from "apollo-boost";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import LoginForm from "../components/Auth/LoginForm";
import redirect from "../lib/redirect";
import Link from "next/link";
import { TOKEN_MAXAGE, TOKEN_COOKIE } from "../lib/constants";
import { Login, LoginVariables } from "./types/Login";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      user {
        name
        id
        email
      }
    }
  }
`;

class LoginMutation extends Mutation<Login, LoginVariables> {}

class LoginPage extends React.Component<ApolloPageProps> {
  _handleLoginComplete = async (data: Login) => {
    document.cookie = cookie.serialize(TOKEN_COOKIE, data.login.token, {
      maxAge: TOKEN_MAXAGE
    });
    await this.props.client.cache.reset();
    redirect();
  };

  render() {
    return (
      <div className="grav-o-container">
        <LoginMutation
          mutation={LOGIN_USER}
          onCompleted={this._handleLoginComplete}
        >
          {function(loginUser, { loading, error }) {
            return (
              <LoginForm
                error={error && error.graphQLErrors[0].message}
                isProcessing={loading}
                login={(email, password) =>
                  loginUser({ variables: { email, password } })
                }
              />
            );
          }}
        </LoginMutation>
        <Link href="/register">
          <a>Need an account? Sign up here.</a>
        </Link>
      </div>
    );
  }
}

export default withApollo(LoginPage);
