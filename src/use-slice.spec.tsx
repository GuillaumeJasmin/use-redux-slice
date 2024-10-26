import React from "react";
import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { useSlice } from "./use-slice";

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

describe("useSlice", () => {
  it("should be able to change value", async () => {
    const store = configureStore({
      reducer: {
        authentication: authenticationSlice.reducer,
        article: articleSlice.reducer,
      },
    });

    const { result } = renderHook(() => useArticle(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.articleName).toEqual("Lord of the Rings");
    expect(result.current.userName).toEqual("John");

    act(() => {
      store.dispatch(authenticationSlice.actions.setUser({ name: "Jane" }));
    });

    expect(result.current.articleName).toEqual("Lord of the Rings");
    expect(result.current.userName).toEqual("Jane");
  });
});
