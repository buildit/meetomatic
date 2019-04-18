import React, { Component } from "react";

import CreateBoardInterface from "./CreateBoard.interface";

export default class CreateBoard extends Component<CreateBoardInterface, {}> {
  constructor(props: CreateBoardInterface) {
    super(props);
  }

  render() {
    return (
      <form className="grav-o-container">
        <h2>Create board</h2>
        <div className="grav-c-form-group">
          <label htmlFor="boardName">Board name</label>
          <input id="boardName" type="text" />
        </div>
        <div className="grav-c-form-group">
          <label htmlFor="boardPassword">Board password (optional)</label>
          <input id="boardPassword" type="password" />
        </div>
        <button type="submit">Create board</button>
      </form>
    );
  }
}
