import * as React from "react";
import Board from "./board";
import * as SocketIO from "socket.io";
import Link from "next/link";
// import "../styles.scss";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
  id?: string;
}

interface State {
  hello: string;
}

export default class extends React.Component<Props, State> {
  protected getSocket = () => this.socket;
  private socket: SocketIO.Socket;

  static getInitialProps(ctx) {
    return ctx.query;
  }

  constructor(props) {
    super(props);

    // this.socket = io();
    this.state = {
      hello: ""
    };
  }

  componentDidMount() {
    // this.socket.on("connected", data => {
    //   this.setState({
    //     hello: data.message
    //   });
    // });
  }

  render() {
    return (
      <div>
        <Link as={`/board/123`} href={`/borad?id=123`}>
          <a>Board 123</a>
        </Link>
        <Board name="" />
      </div>
    );
  }
}
