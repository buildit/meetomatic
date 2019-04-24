import * as React from "react";
import "../styles.scss";
import { ApolloClient, InMemoryCache, gql } from "apollo-boost";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import redirect from "../lib/redirect";
import CreateBoard from "../components/CreateBoard/CreateBoard";

export interface Props {
    client: ApolloClient<InMemoryCache>;
}

const CREATE_BOARD = gql`
  mutation createBoard($name: String!, $password: String!) {
    createBoard(name: $name, password: $password) {
      id
    }
  }
`;


class Board extends React.Component<Props> {
    _handleBoardCreation = async data => {
      redirect(data, "/board");
    };
  
    render() {
      return (
        <Mutation
          mutation={CREATE_BOARD}
          onCompleted={this._handleBoardCreation}
        >
          {function(createBoard, { loading, error }) {
            return (
                <CreateBoard
                    // error={error && error.graphQLErrors[0].message}
                    isProcessing={loading}
                    createBoard = {(name, password) => {
                        createBoard({variables: {name, password}})
                    }}
                />
            );
          }}
        </Mutation>
      );
    }
  }
  
  export default withApollo(Board);
  