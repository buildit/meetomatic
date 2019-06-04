
import * as React from "react";

import CardInterface from './Card.interface'

export default class Card extends React.Component<CardInterface, {}> {

constructor (props: CardInterface){
super(props);
}
  render() {
    return (  <div>
              <h1>Card</h1>
                {this.props.message}
                <br/>
                {this.props.date},
                <br/>
                {this.props.votes}
            </div>
    );
  }
}