import * as React from "react";

interface RegisterFormProps {
  createUser(name: string, email: string, password: string): any;
}

export default class RegisterForm extends React.Component<RegisterFormProps> {
  private nameInput = React.createRef<HTMLInputElement>();
  private emailInput = React.createRef<HTMLInputElement>();
  private passwordInput = React.createRef<HTMLInputElement>();

  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    this.props.createUser(
      this.nameInput.current.value,
      this.emailInput.current.value,
      this.passwordInput.current.value
    );
  }

  render() {
    return (
      <div className="mom-container">
        <h1>Register</h1>
        <form onSubmit={this._handleSubmit}>
          <div>
            <input
              ref={this.nameInput}
              type="text"
              placeholder="Enter your name..."
            />
          </div>
          <div>
            <input
              ref={this.emailInput}
              type="text"
              placeholder="Enter your email..."
            />
          </div>
          <div>
            <input
              ref={this.passwordInput}
              type="password"
              placeholder="Enter a password"
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}
