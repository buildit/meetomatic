import * as React from "react";

export interface State {
  showForm: boolean;
}

export interface Props {
  addNewCard: any;
  handleCardChange: any;
  newCardTitle: string;
}

export default class NewCard extends React.Component<Props, State> {
  constructor(props: Props) {
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
    this.props.handleCardChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addNewCard();
  }

  render() {
    return (
      <div className="grav-c-card">
        <button
          className="grav-c-button-link add-card-link"
          type="button"
          onClick={this.toggleCardForm}
          aria-pressed={this.state.showForm}
        >
          Add a new card
        </button>
        {this.state.showForm ? (
          <form className="add-card-form" onSubmit={this.handleSubmit}>
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
