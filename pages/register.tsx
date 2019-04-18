import React from "react";
import { gql } from "apollo-boost";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import redirect from "../lib/redirect";
import RegisterForm from "../components/Auth/RegisterForm";
import Link from "next/link";
import { TOKEN_MAXAGE, TOKEN_COOKIE } from "../lib/constants";

const CREATE_USER = gql`
  mutation signup($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

class Register extends React.Component<ApolloPageProps> {
  _handleRegisterComplete = async ({ signup: { token } }) => {
    document.cookie = cookie.serialize(TOKEN_COOKIE, token, {
      maxAge: TOKEN_MAXAGE
    });
    await this.props.client.cache.reset();
    redirect();
  };

  render() {
    return (
      <div className="grav-o-container">
        <Mutation
          mutation={CREATE_USER}
          onCompleted={this._handleRegisterComplete}
        >
          {function(createUser, { loading, error }) {
            return (
              <RegisterForm
                error={error && error.graphQLErrors[0].message}
                isProcessing={loading}
                createUser={(name, email, password) =>
                  createUser({ variables: { name, email, password } })
                }
              />
            );
          }}
        </Mutation>
        <Link href="/login">
          <a>Already have an account? Login</a>
        </Link>
      </div>
    );
  }
}

export default withApollo(Register);
