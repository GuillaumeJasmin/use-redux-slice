import { renderHook } from "@testing-library/react";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { mockSlice } from "./mock-slice";
import { useSlice } from "../../use-slice";

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    userName: "John",
  },
  reducers: {
    setUser(state, action: PayloadAction<{ name: string }>) {
      state.userName = action.payload.name;
    },
  },
  selectors: {
    selectUserName(state) {
      return state.userName;
    },
  },
});

const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleName: "Lord of the Rings",
  },
  reducers: {
    // ...
  },
  selectors: {
    selectArticleName(state) {
      return state.articleName;
    },
  },
});

function useArticle() {
  const { useSelectUserName, setUser } = useSlice(authenticationSlice);
  const { useSelectArticleName } = useSlice(articleSlice);

  const userName = useSelectUserName();
  const articleName = useSelectArticleName();

  return {
    userName,
    articleName,
    setUser,
  };
}

describe("testing useSlice", () => {
  afterEach(() => {
    mockSlice.beforeEach();
  });

  it("should be able to mock selector return", () => {
    mockSlice(authenticationSlice, {
      useSelectUserName: () => "Joe",
    });

    mockSlice(articleSlice, {
      useSelectArticleName: () => "Harry Poter",
    });

    const { result } = renderHook(() => useArticle());

    expect(result.current.articleName).toEqual("Harry Poter");
    expect(result.current.userName).toEqual("Joe");
  });

  it("should be able to spy actions", () => {
    const { setUser } = mockSlice(authenticationSlice, {
      useSelectUserName: () => "Joe",
    });

    mockSlice(articleSlice, {
      useSelectArticleName: () => "Harry Poter",
    });

    const { result } = renderHook(() => useArticle());

    result.current.setUser({ name: "Jane" });

    expect(setUser).toHaveBeenCalledWith({
      name: "Jane",
    });
  });
});
