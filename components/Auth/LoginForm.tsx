import React, { Component } from "react";

interface LoginFormProps {
  login(email: string, password: string): any;
  isProcessing: boolean;
  error: string;
}

export default class RegisterForm extends Component<LoginFormProps> {
  private emailInput = React.createRef<HTMLInputElement>();
  private passwordInput = React.createRef<HTMLInputElement>();

  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    this.props.login(
      this.emailInput.current.value,
      this.passwordInput.current.value
    );
  }

  render() {
    const { isProcessing, error } = this.props;
    return (
      <div>
        <h1>Login</h1>
        {error && <div>{error}</div>}
        <form onSubmit={this._handleSubmit}>
          <div>
            <input
              disabled={isProcessing}
              ref={this.emailInput}
              type="text"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              disabled={isProcessing}
              ref={this.passwordInput}
              type="password"
              placeholder="Password"
            />
          </div>
          <button disabled={isProcessing} type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
}
