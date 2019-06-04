import * as React from "react";

interface Props {
  boardName: string
}

export default class StatusBar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
        <div className="grav-c-status-bar">
          <h2>📋 {this.props.boardName}</h2>
          <div className="grav-c-status-bar__item">
            <ul>
              <li><span className="grav-c-avatar">DB</span></li>
              <li><span className="grav-c-avatar">AM</span></li>
              <li><span className="grav-c-avatar">JR</span></li>
            </ul>
          </div>
          <div className="grav-c-status-bar__item">
            <span>👍 X votes remaining</span>
          </div>
        </div>
    );
  }
}
