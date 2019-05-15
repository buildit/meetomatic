import * as React from "react";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  hello: string;
}

export default class extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      hello: ""
    };
  }

  render() {
    return <div>Hello World from Room!</div>;
  }
}
