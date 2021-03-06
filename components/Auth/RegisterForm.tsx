import React from "react";

interface RegisterFormProps {
  createUser(name: string, email: string, password: string): any;
  isProcessing: boolean;
  error: string;
}

interface RegisterFormState {
  canRegister: boolean;
}

export default class RegisterForm extends React.Component<
  RegisterFormProps,
  RegisterFormState
> {
  private nameInput = React.createRef<HTMLInputElement>();
  private emailInput = React.createRef<HTMLInputElement>();
  private passwordInput = React.createRef<HTMLInputElement>();

  state = {
    canRegister: false
  };

  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleInputChange = () => {
    const canRegister =
      this.nameInput.current.value &&
      this.emailInput.current.value &&
      this.passwordInput.current.value;
    this.setState({ canRegister: !!canRegister });
  };

  _handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    this.props.createUser(
      this.nameInput.current.value,
      this.emailInput.current.value,
      this.passwordInput.current.value
    );
  }

  render() {
    const { isProcessing, error } = this.props;
    const { canRegister } = this.state;
    return (
      <div>
        <h1>Register</h1>
        {error && <div>{error}</div>}
        <form onSubmit={this._handleSubmit}>
          <div>
            <input
              onChange={this._handleInputChange}
              disabled={isProcessing}
              ref={this.nameInput}
              type="text"
              placeholder="Enter your name..."
            />
          </div>
          <div>
            <input
              onChange={this._handleInputChange}
              disabled={isProcessing}
              ref={this.emailInput}
              type="text"
              placeholder="Enter your email..."
            />
          </div>
          <div>
            <input
              onChange={this._handleInputChange}
              disabled={isProcessing}
              ref={this.passwordInput}
              type="password"
              placeholder="Enter a password"
            />
          </div>
          <button disabled={!canRegister || isProcessing} type="submit">
            Create
          </button>
        </form>
      </div>
    );
  }
}
