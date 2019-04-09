import * as React from "react"; 
import CreateBoard from '../components/CreateBoard/CreateBoard';
import * as io from 'socket.io-client';
import * as SocketIO from 'socket.io';
import "../styles.scss";

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

    this.socket = io();  
    this.state = {
        hello: ''
    }   
  }

  componentDidMount() {
    this.socket.on('connected', data => {
        this.setState({
            hello: data.message
        })
    })
  }
    
  render() {    
    return (
      <div>
         <CreateBoard name="" password="" />
      </div>
    )
  }
}