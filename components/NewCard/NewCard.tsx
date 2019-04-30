import React from "react";
import NewCardInterface from "./NewCard.interface";

export interface State {
  showForm: boolean;
}

export default class NewCard extends React.Component<
  NewCardInterface,
  State,
  {}
> {
  constructor(props: NewCardInterface) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleCardForm = this.toggleCardForm.bind(this);

    this.state = {
      showForm: false
    };
  }

  toggleCardForm() {
    this.setState({
      showForm: !this.state.showForm
    });
  }

  handleChange(event) {
    this.props.handleCardChange(event);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.addNewCard();

    this.setState({
      showForm: false
    });
  }

  render() {
    return (
      <div className="grav-c-card">
        <button className="grav-c-button-link" type="button" onClick={this.toggleCardForm} aria-pressed={this.state.showForm}>Add a new card</button>
          {this.state.showForm ? (
            <form onSubmit={this.handleSubmit}>
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
          ) : null}
      </div>
    );
  }
}
