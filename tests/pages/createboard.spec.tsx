jest.mock("../../lib/redirect");
import * as React from "react";
import { mount } from "enzyme";
import CreateBoardPage, { CREATE_BOARD } from "../../pages/createboard";
import { MockedProvider } from "react-apollo/test-utils";
import { CreateBoard } from "../../pages/types/CreateBoard";
import wait from "../../lib/wait";
import redirect from "../../lib/redirect";

const data: CreateBoard = {
  createBoard: {
    __typename: "CreateBoardPayload",
    board: {
      __typename: "Board",
      id: "12345"
    }
  }
};

const mocks = [
  {
    request: {
      query: CREATE_BOARD,
      variables: { name: "My Board", password: "mypassword" }
    },
    result: { data }
  }
];

function createBoardPage(props) {
  return mount<MockedProvider>(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CreateBoardPage {...props} />
    </MockedProvider>
  );
}

describe("<CreateBoardPage />", () => {
  it("should render CreateBoard form", () => {
    const board = createBoardPage({});
    expect(board.find("CreateBoard")).toHaveLength(1);
    expect(board.find("CreateBoard").prop("isProcessing")).toBeFalsy();
  });

  it("does redirect to board after create", async () => {
    const board = createBoardPage({});
    const boardName = board.find("#boardname");
    boardName.instance().value = "My Board";
    boardName.simulate("change");
    const boardPassword = board.find("#boardpassword");
    boardPassword.instance().value = "mypassword";
    boardPassword.simulate("change");
    board.find("button").simulate("submit");
    expect(board.find("CreateBoard").prop("isProcessing")).toBeTruthy();
    await wait(0);
    expect(redirect).toBeCalledWith({}, "/board/12345");
  });
});
