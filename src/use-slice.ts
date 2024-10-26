/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { OmitFirst } from "./helpers/omit-first";
import { capitalize } from "./helpers/capitalize";
import { Slice } from "./types";

export function useSlice<S extends Slice>(slice: S) {
  const dispatch = useDispatch();

  const selectors = useMemo(() => {
    return Object.entries(slice.selectors).reduce(
      (acc, [selectorName, selector]) => {
        return {
          ...acc,
          [`use${capitalize(selectorName)}`]: (...params: any[]) => {
            const memoizedSelector = useMemo(() => {
              return (state: any) => selector(state, ...params);
            }, [...params]);

            return useSelector(memoizedSelector);
          },
        };
      },
      {} as {
        [Key in keyof S["selectors"] &
          string as `use${Capitalize<Key>}`]: (
          ...params: OmitFirst<Parameters<S["selectors"][Key]>>
        ) => ReturnType<S["selectors"][Key]>;
      }
    );
  }, [slice.selectors]);

  const actions = useMemo(() => {
    return Object.entries(slice.actions).reduce(
      (acc, [actionName, action]) => {
        return {
          ...acc,
          [actionName]: (...params: any[]) => {
            return dispatch(action(...params));
          },
        };
      },
      {} as S["actions"]
    );
  }, [dispatch, slice.actions]);

  return {
    ...selectors,
    ...actions,
  };
}
