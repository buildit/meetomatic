import * as React from "react";
import Link from "next/link";

export interface Props {}

interface State {}

export default class extends React.Component<Props, State> {
  static getInitialProps(ctx) {
    return ctx.query;
  }

  render() {
    return (
      <div>
        <Link as={`/board/123`} href={`/board?id=123`}>
          <a>Board 123</a>
        </Link>
      </div>
    );
  }
}
