import * as useSliceHooks from "../../use-slice";
import { createMockSlice } from "../create-mock-slice";
import { Slice } from "@reduxjs/toolkit";

const jestConfig = {
  createSpy: () => jest.fn(),
  mockImplementation: (implementations: any) => {
    jest.spyOn(useSliceHooks, "useSlice").mockImplementation((slice) => {
      return implementations[slice.name];
    });
  },
};

export const mockSlice = createMockSlice(jestConfig);
