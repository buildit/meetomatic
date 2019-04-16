import * as React from "react";
import "../styles.scss";
import { ApolloClient, InMemoryCache, gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import cookie from "cookie";
import redirect from "../lib/redirect";
import RegisterForm from "../components/Auth/RegisterForm";

export interface Props {
  client: ApolloClient<InMemoryCache>;
}

interface State {
  email: string;
  name: string;
  password: string;
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

export default class extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      password: ""
    };
  }

  _handleRegisterComplete(data) {
    document.cookie = cookie.serialize("token", data.signup.token, {
      maxAge: 30 * 24 * 60 * 60
    });
    redirect({}, "/");
  }

  render() {
    return (
      // TODO: onCompleted onError
      <Mutation
        mutation={CREATE_USER}
        onCompleted={this._handleRegisterComplete}
      >
        {function(createUser) {
          return (
            <RegisterForm
              createUser={(name, email, password) =>
                createUser({ variables: { name, email, password } })
              }
            />
          );
        }}
      </Mutation>
    );
  }
}
