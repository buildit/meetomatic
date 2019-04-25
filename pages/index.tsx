import * as React from "react";
import CreateBoard from "../components/CreateBoard/CreateBoard";
import * as io from "socket.io-client";
import * as SocketIO from "socket.io";
import Link from "next/link";
// import "../styles.scss";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  hello: string;
}

export default class extends React.Component<Props, State> {
  protected getSocket = () => this.socket;
  private socket: SocketIO.Socket;

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
        <CreateBoard name="" password="" />
      </div>
    );
  }
}
