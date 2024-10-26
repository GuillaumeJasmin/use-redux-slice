
<div align="center">
  <h1>
    Use Redux Slice
    <br/>
    <br/>
  </h1>
    <br/>
    <br/>
    <a href="https://www.npmjs.com/package/use-redux-slice">
      <img src="https://img.shields.io/npm/v/use-redux-slice.svg" alt="npm package" />
    </a>
    <br/>
    <br/>
    React hook for <a href="https://redux-toolkit.js.org/">redux-toolkit</a> slice
    <br/>
  <br/>
  <br/>
  <pre>npm i <a href="https://www.npmjs.com/package/use-redux-slice">use-redux-slice</a></pre>
  <br/>
  <br/>
</div>

## Documentation

* [Motivation](#motivation)
* [Examples](#examples)
* [Tests](#tests)

## Motivation

Reduce boilerplate when you need to use redux slice inside react hooks or components.

`useSlice()` binds actions and selectors using `useSelector` and `useDispatch` internally.

## Examples

`authentication-slice.ts`

```ts
import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isLogged: false
  },
  reducers: {
    login(state) {
      state.isLogged = true;
    },
    logout(state) {
      state.isLogged = false;
    },
  },
  selectors: {
    selectIsLogged(state) {
      return state.isLogged;
    },
  }
});
```

`app.tsx`

```tsx
import { useSlice } from 'use-redux-slice';
import { authenticationSlice } from './authentication-slice';

function App() {
  const { login, logout, useSelectIsLogged } = useSlice(authenticationSlice);
  
  const isLogged = useSelectIsLogged();

  if (isLogged) {
    return (
      <button onClick={login}>Login</button>
    );
  }

  return (
    <button onClick={logout}>Logout</button>
  );
}

```

## Test

You can easely mock `useSlice` with predefined methods for jest or vitest.

### Mock selectors

Internally, `jest.spyOn()` or `vi.spyOn()` is used to mock a selector:

```ts
import { mockSlice } from 'use-redux-slice/test/jest';
// OR
import { mockSlice } from 'use-redux-slice/test/vitest';

import { App } from './app';
import { authenticationSlice } from './authentication-slice';

describe('...', () => {
  beforeEach(() => {
    mockSlice.beforeEach();
  });

  it('should render login button', () => {
    mockSlice(authenticationSlice, {
      useIsLogged: () => false,
    });

    render(<App>);

    expect(screen.getByRole('button', { name: 'Login' })).toBeDefined();
  });

  it('should render logout button', () => {
    mockSlice(authenticationSlice, {
      useIsLogged: () => true,
    });

    render(<App>);

    expect(screen.getByRole('button', { name: 'Logout' })).toBeDefined();
  });
});

```

### Mock and spy actions

Internally, `jest.fn()` or `vi.fn()` is used to mock an action:

```ts
describe('...', () => {
  beforeEach(() => {
    mockSlice.beforeEach();
  });

  it('should login action be triggerrd', () => {
    const { login } = mockSlice(authenticationSlice, {
      useIsLogged: () => false,
    });

    render(<App>);

    const loginButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(loginButton);

    expect(login).toHaveBeenCalled();
  });

});
```
