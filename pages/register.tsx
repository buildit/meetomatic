import React from "react";
import { ApolloClient, InMemoryCache, gql } from "apollo-boost";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import redirect from "../lib/redirect";
import RegisterForm from "../components/Auth/RegisterForm";
import Link from "next/link";

export interface Props {
  client: ApolloClient<InMemoryCache>;
}

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

class Register extends React.Component<Props> {
  _handleRegisterComplete = async data => {
    document.cookie = cookie.serialize("token", data.signup.token, {
      maxAge: 30 * 24 * 60 * 60
    });
    await this.props.client.cache.reset();
    redirect({}, "/");
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
