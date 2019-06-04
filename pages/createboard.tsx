import * as React from "react";
import gql from "graphql-tag";
import { Mutation, withApollo } from "react-apollo";
import redirect from "../lib/redirect";
import CreateBoardWidget from "../components/CreateBoard/CreateBoard";
import { CreateBoard } from "./types/CreateBoard";
import { CreateBoardInput } from "../server/graph-server/schemas/board";

export interface Props {
  client: any;
}

export const CREATE_BOARD = gql`
  mutation CreateBoard($name: String!, $password: String!) {
    createBoard(
      input: {
        name: $name
        password: $password
        columns: [
          { name: "Not Started" }
          { name: "In Progress" }
          { name: "Done" }
        ]
      }
    ) {
      board {
        id
      }
    }
  }
`;

class CreateBoardMutation extends Mutation<CreateBoard, CreateBoardInput> {}

class Board extends React.Component<Props> {
  _handleBoardCreation = async (data: CreateBoard) => {
    const boardId = data.createBoard.board.id;
    redirect({}, `/board/${boardId}`);
  };

  render() {
    return (
      <CreateBoardMutation
        mutation={CREATE_BOARD}
        onCompleted={this._handleBoardCreation}
      >
        {function(createBoard, { loading }) {
          return (
            <CreateBoardWidget
              // error={error && error.graphQLErrors[0].message}
              isProcessing={loading}
              createBoard={(name, password) => {
                createBoard({ variables: { name, password } });
              }}
            />
          );
        }}
      </CreateBoardMutation>
    );
  }
}

export default withApollo(Board);
