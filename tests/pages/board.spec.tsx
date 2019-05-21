import * as React from "react";
import { mount } from "enzyme";
import BoardPage, { CREATE_CARD } from "../../pages/board";
import { MockedProvider } from "react-apollo/test-utils";
import { Board, BoardVariables } from "../../client/types/Board";
import wait from "../../lib/wait";
import Card from "../../components/Card/Card";
import { CreateCardVariables, CreateCard } from "pages/types/CreateCard";
import { GET_BOARD, GET_USER } from "../../client/queries";
import boardResolvers from "../../client/boardResolvers";
import { CurrentUser } from "../../client/types/CurrentUser";
import { Query } from "react-apollo";

const data: Board = {
  board: {
    __typename: "Board",
    id: "12345",
    name: "My Board",
    maxVotes: 6,
    remainingVotes: 6,
    owner: {
      __typename: "User",
      id: "User1",
      email: "user@meetomatic.com",
      name: "User One"
    },
    columns: [
      {
        __typename: "Column",
        id: "Col1",
        name: "Not Started",
        cards: []
      },
      {
        __typename: "Column",
        id: "Col2",
        name: "Done",
        cards: [
          {
            __typename: "Card",
            id: "Card1",
            description: "Not Started",
            column: {
              __typename: "Column",
              id: "Col2"
            },
            owner: {
              __typename: "User",
              email: "user2@meetomatic.com",
              id: "User2",
              name: "User Two"
            },
            votes: []
          }
        ]
      }
    ]
  }
};

const variables: BoardVariables = {
  id: "12345"
};

const loadBoardMock = {
  request: {
    query: GET_BOARD,
    variables
  },
  result: { data }
};

const currentUser: CurrentUser = {
  currentUser: {
    __typename: "User",
    id: "User1",
    email: "user@meetomatic.com",
    name: "User One"
  }
};

const currentUserMock = {
  request: {
    query: GET_USER
  },
  result: { data: currentUser }
};

function createBoardPage(props, mocks: any[]) {
  return mount<MockedProvider>(
    <MockedProvider mocks={mocks} resolvers={boardResolvers} addTypename={true}>
      <Query query={GET_USER}>
        {() => {
          return <BoardPage subscribeToUpdates={false} {...props} />;
        }}
      </Query>
    </MockedProvider>
  );
}

describe("<BoardPage />", () => {
  describe("render", () => {
    it("should render loading state", () => {
      const wrapper = createBoardPage({ id: "12345" }, [
        loadBoardMock,
        currentUserMock
      ]);
      expect(wrapper.find(".loading")).toHaveLength(1);
    });

    it("should render board title", async () => {
      const wrapper = createBoardPage({ id: "12345" }, [
        loadBoardMock,
        currentUserMock
      ]);
      await wait(0);
      await wait(0);
      wrapper.update();
      const board = wrapper.find(BoardPage);
      expect(wrapper.find(".board-title").text()).toEqual("My Board");
      expect(board).toHaveLength(1);
    });

    it("should render BoardWidget", async () => {
      const wrapper = createBoardPage({ id: "12345" }, [
        loadBoardMock,
        currentUserMock
      ]);
      await wait(0);
      await wait(0);
      wrapper.update();
      const widget = wrapper.find("Board");
      expect(widget).toHaveLength(1);
      expect(widget.prop("columns")).toHaveLength(2);
      expect(widget.prop("name")).toEqual("My Board");
    });
  });

  describe("#CreateCard", () => {
    const createCardVariables: CreateCardVariables = {
      columnId: "Col1",
      description: "New Card"
    };

    const createCardData: CreateCard = {
      createCard: {
        __typename: "CreateCardPayload",
        card: {
          __typename: "Card",
          id: "New1",
          description: "New Card",
          column: {
            __typename: "Column",
            id: "Col1",
            name: "Not Started"
          },
          owner: {
            __typename: "User",
            id: "User1",
            email: "user@meetomatic.com",
            name: "User One"
          },
          votes: []
        }
      }
    };
    const createCardMock = {
      request: {
        query: CREATE_CARD,
        variables: createCardVariables
      },
      result: { data: createCardData }
    };
    it("does add new card to cache", async () => {
      const wrapper = createBoardPage({ id: "12345" }, [
        loadBoardMock,
        currentUserMock,
        createCardMock
      ]);
      await wait(0);
      await wait(0);
      wrapper.update();
      expect(wrapper.find(Card)).toHaveLength(1);
      wrapper.find(".add-card-link").simulate("click");
      expect(wrapper.find(".add-card-form")).toHaveLength(1);
      const input = wrapper.find(".add-card-form").find("input") as any;
      input.instance().value = "New Card";
      input.simulate("change");
      wrapper
        .find(".add-card-form")
        .find("button")
        .simulate("submit");
      await wait(0);
      wrapper.update();
      expect(wrapper.find(Card)).toHaveLength(2);
    });
  });
});
