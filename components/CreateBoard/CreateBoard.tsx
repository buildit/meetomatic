import * as React from "react";

interface CreateFormProps {
  createBoard(name: string, password: string): any;
  isProcessing: boolean;
  error?: string;
}

export default class CreateBoard extends React.Component<CreateFormProps> {
  private nameInput = React.createRef<HTMLInputElement>();
  private passwordInput = React.createRef<HTMLInputElement>();

  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    this.props.createBoard(
      this.nameInput.current.value,
      this.passwordInput.current.value
    );
  }

  render() {
    const { isProcessing, error } = this.props;
    return (
      <div className="grav-o-container">
        <h1>Create Board</h1>
        {error && <div>{error}</div>}
        <form onSubmit={this._handleSubmit}>
          <div>
            <input
              id="boardname"
              disabled={isProcessing}
              ref={this.nameInput}
              type="text"
              placeholder="Board Name"
            />
          </div>
          <div>
            <input
              id="boardpassword"
              disabled={isProcessing}
              ref={this.passwordInput}
              type="password"
              placeholder="Enter a password"
            />
          </div>
          <button disabled={isProcessing} type="submit">
            Create Board
          </button>
        </form>
      </div>
    );
  }
}
