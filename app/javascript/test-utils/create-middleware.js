import { fromJS } from "immutable";
import { spy } from "sinon";

import { createMockStore } from "./create-mock-store";

const createMiddleware = (middleware, initialState) => {
  const { store } = createMockStore(fromJS({}), initialState);

  const next = spy();

  const invoke = action => middleware(store)(next)(action);

  return { store, next, invoke };
};

export default createMiddleware;
