import React from "react";
import gql from "graphql-tag";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import redirect from "../lib/redirect";
import RegisterForm from "../components/Auth/RegisterForm";
import Link from "next/link";
import { TOKEN_MAXAGE, TOKEN_COOKIE } from "../lib/constants";
import { SignUp, SignUpVariables } from "./types/SignUp";

const CREATE_USER = gql`
  mutation SignUp($email: String!, $name: String!, $password: String!) {
    signup(input: { email: $email, name: $name, password: $password }) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

class SignUpMutation extends Mutation<SignUp, SignUpVariables> {}

class RegisterPage extends React.Component<ApolloPageProps> {
  _handleRegisterComplete = async (data: SignUp) => {
    document.cookie = cookie.serialize(TOKEN_COOKIE, data.signup.token, {
      maxAge: TOKEN_MAXAGE
    });
    await this.props.client.cache.reset();
    redirect();
  };

  render() {
    return (
      <div className="grav-o-container">
        <SignUpMutation
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
        </SignUpMutation>
        <Link href="/login">
          <a>Already have an account? Login</a>
        </Link>
      </div>
    );
  }
}

export default withApollo(RegisterPage);
