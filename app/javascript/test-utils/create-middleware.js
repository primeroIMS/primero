// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { createMockStore } from "./create-mock-store";

const createMiddleware = (middleware, initialState) => {
  const { store } = createMockStore(fromJS({}), initialState);

  const next = jest.fn();

  const invoke = action => middleware(store)(next)(action);

  return { store, next, invoke };
};

export default createMiddleware;
