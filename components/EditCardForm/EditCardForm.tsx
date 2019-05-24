import * as React from "react";
import { CardState } from "../../types";
import InlineEdit from "react-edit-inline2";

interface CardProps extends CardState {
  onRenameCard(id: string, description: string);
}

export default class EditCardForm extends React.Component<CardProps, {}> {
  constructor(props: CardProps) {
    super(props);
  }

  render() {
    return (
      <div key={this.props.id}>
        <h2>Edit Card</h2>
        <InlineEdit
          validate={text => text.length > 0}
          text={this.props.description}
          paramName="description"
          change={data =>
            this.props.onRenameCard(this.props.id, data.description)
          }
        />
      </div>
    );
  }
}
