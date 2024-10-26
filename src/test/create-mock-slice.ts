import { OmitFirst } from "../helpers/omit-first";
import { Slice } from "../types";

type Config = {
  createSpy: () => unknown;
  mockImplementation: (implementations: any) => void;
};

export function createMockSlice(config: Config) {
  const implementations: Record<string, Record<string, any>> = {};

  function mockSlice<S extends Slice>(
    mockedSlice: S,
    mockValues: {
      [Key in keyof S["selectors"] & string as `use${Capitalize<Key>}`]: (
        ...params: OmitFirst<Parameters<S["selectors"][Key]>>
      ) => ReturnType<S["selectors"][Key]>;
    }
  ) {
    const isSliceAlreadyMocked = !!implementations[mockedSlice.name];

    if (isSliceAlreadyMocked) {
      throw new Error(
        `The slice ${mockedSlice.name} is already mocked.\n
      Don't forget to call beforeEach():\n
        beforeEach(() => {
          mockSlice.beforeEach();
        });
      `
      );
    }

    const actions = Object.keys(mockedSlice.actions).reduce(
      (acc, actionName) => {
        return {
          ...acc,
          [actionName]: config.createSpy(),
        };
      },
      {} as S["actions"]
    );

    implementations[mockedSlice.name] = {
      ...actions,
      ...mockValues,
    };

    return actions;
  }

  function reset() {
    Object.keys(implementations).forEach((key) => {
      delete implementations[key];
    });
  }

  function beforeEach() {
    reset();
  }

  config.mockImplementation(implementations);

  mockSlice.beforeEach = beforeEach;

  return mockSlice;
}
