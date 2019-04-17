import React from "react";
import NewCardInterface from "./NewCard.interface";

export interface Props {
  NewCardTitle: string;
}

export default class NewCard extends React.Component<
  NewCardInterface,
  Props,
  {}
> {
  constructor(props: NewCardInterface) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleCardChange(event);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.addNewCard();
  }

  render() {
    return (
      <form className="grav-c-card" onSubmit={this.handleSubmit}>
        <h3 className="grav-c-card__title">New card</h3>
        <div className="grav-c-form-group">
          <label htmlFor="boardName">Title</label>
          <input
            id="boardName"
            type="text"
            name="name"
            value={this.props.NewCardTitle}
            required
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Add card</button>
      </form>
    );
  }
}
