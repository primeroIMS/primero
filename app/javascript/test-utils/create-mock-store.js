// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { createMemoryHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router/immutable";
import { applyMiddleware, compose, createStore } from "redux";
import { combineReducers } from "redux-immutable";
import thunk from "redux-thunk";

import rootReducer from "../reducer";

const DEFAULT_STATE = fromJS({
  connectivity: {
    online: true,
    serverOnline: true
  }
});

let actions = [];

const loggerMiddleware = () => next => action => {
  actions.push(action);

  return next(action);
};

function createMockStore(defaultState = fromJS({}), initialState) {
  actions = [];
  const history = createMemoryHistory();
  const middleware = [loggerMiddleware, routerMiddleware(history), thunk];

  const store = createStore(
    combineReducers({
      router: connectRouter(history),
      ...rootReducer
    }),
    fromJS(defaultState).merge(fromJS(initialState)),
    compose(applyMiddleware(...middleware))
  );

  store.getActions = () => actions;

  store.clearActions = () => {
    actions = [];
  };

  return { store, history };
}

export { DEFAULT_STATE, createMockStore };
