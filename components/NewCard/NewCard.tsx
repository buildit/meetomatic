import React from "react";

export interface Props {
  addNewCard: any;
  handleCardChange: any;
  newCardTitle: string;
}

export default class NewCard extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.handleCardChange(event.target.value);
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
            value={this.props.newCardTitle}
            required
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">Add card</button>
      </form>
    );
  }
}
