import { vi } from "vitest";
import * as useSliceHooks from "../../use-slice";
import { createMockSlice } from "../create-mock-slice";
import { Slice } from "@reduxjs/toolkit";

export const vitestConfig = {
  createSpy: () => vi.fn(),
  mockImplementation: (implementations: any) => {
    vi.spyOn(useSliceHooks, "useSlice").mockImplementation((slice) => {
      return implementations[slice.name];
    });
  },
};

export const mockSlice = createMockSlice(vitestConfig);
