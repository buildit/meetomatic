import * as React from "react";
import Link from "next/link";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { UserBoardList } from "./types/UserBoardList";
import { BoardState } from "types";

export interface Props {}

interface State {}

const GET_USER_BOARD_LIST = gql`
  query UserBoardList {
    boards {
      id
      name
      owner {
        id
        name
        email
      }
    }
  }
`;

class UserBoardListQuery extends Query<UserBoardList> {}
export default class extends React.Component<Props, State> {
  static getInitialProps(ctx) {
    return ctx.query;
  }

  _renderBoardLink(board: BoardState) {
    return (
      <div>
        <Link as={`/board/${board.id}`} href={`/board?id=${board.id}`}>
          <a>{board.name}</a>
        </Link>
      </div>
    );
  }
  render() {
    return (
      <div className="grav-o-container">
        <h2>Board List</h2>
        <UserBoardListQuery query={GET_USER_BOARD_LIST}>
          {({ data }) => {
            return data.boards.map(b => this._renderBoardLink(b));
          }}
        </UserBoardListQuery>
        <div>
          <Link href="/board/create">
            <button>Create new board</button>
          </Link>
        </div>
      </div>
    );
  }
}
