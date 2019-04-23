import React, { Component } from "react";

interface LoginFormProps {
  login(email: string, password: string): any;
  isProcessing: boolean;
  error: string;
}

interface LoginFormState {
  canLogin: boolean;
}

export default class RegisterForm extends Component<
  LoginFormProps,
  LoginFormState
> {
  private emailInput = React.createRef<HTMLInputElement>();
  private passwordInput = React.createRef<HTMLInputElement>();

  state = {
    canLogin: false
  };

  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleInputChange = () => {
    this.setState({
      canLogin:
        !!this.emailInput.current.value && !!this.passwordInput.current.value
    });
  };

  _handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    this.props.login(
      this.emailInput.current.value,
      this.passwordInput.current.value
    );
  }

  render() {
    const { isProcessing, error } = this.props;
    const { canLogin } = this.state;
    return (
      <div>
        <h1>Login</h1>
        {error && <div>{error}</div>}
        <form onSubmit={this._handleSubmit}>
          <div>
            <input
              disabled={isProcessing}
              ref={this.emailInput}
              onChange={this._handleInputChange}
              type="text"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              disabled={isProcessing}
              ref={this.passwordInput}
              onChange={this._handleInputChange}
              type="password"
              placeholder="Password"
            />
          </div>
          <button disabled={!canLogin || isProcessing} type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
}
