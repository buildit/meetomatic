import Router from "next/router";

export default function redirect(context: { res?: any } = {}, target = "/") {
  if (context.res) {
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    Router.push(target);
  }
}
