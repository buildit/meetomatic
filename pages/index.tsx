import React from 'react';
import Card from '../components/Card/Card';
import io from 'socket.io-client';
import * as SocketIO from 'socket.io';
import { ProgressPlugin } from 'webpack';

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
    this.socket.on('now', data => {
        this.setState({
            hello: data.message
        })
    })
  }
    
  render() {    
    return (
      <div>
         <Card 
            message="Logrocket" 
            date="today" 
            votes="20"
        />
         <h1>{this.state.hello}</h1>
      </div>
    )
  }
}