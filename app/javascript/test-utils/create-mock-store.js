// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { createMemoryHistory } from "history";
import { routerMiddleware } from "connected-react-router/immutable";

const DEFAULT_STATE = fromJS({
  connectivity: {
    online: true,
    serverOnline: true
  }
});

const createMockStore = (defaultState = fromJS({}), initialState) => {
  const history = createMemoryHistory();
  const mockStore = configureStore([routerMiddleware(history), thunk]);
  const store = mockStore(defaultState.merge(fromJS(initialState)));

  return { store, history };
};

export { DEFAULT_STATE, createMockStore };
