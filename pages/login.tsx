import React from "react";
import { gql } from "apollo-boost";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import LoginForm from "../components/Auth/LoginForm";
import redirect from "../lib/redirect";
import Link from "next/link";
import { TOKEN_MAXAGE, TOKEN_COOKIE } from "../lib/constants";

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
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

class Login extends React.Component<ApolloPageProps> {
  _handleLoginComplete = async ({ login: { token } }) => {
    document.cookie = cookie.serialize(TOKEN_COOKIE, token, {
      maxAge: TOKEN_MAXAGE
    });
    await this.props.client.cache.reset();
    redirect();
  };

  render() {
    return (
      <div className="grav-o-container">
        <Mutation mutation={LOGIN_USER} onCompleted={this._handleLoginComplete}>
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
        </Mutation>
        <Link href="/register">
          <a>Need an account? Sign up here.</a>
        </Link>
      </div>
    );
  }
}

export default withApollo(Login);
