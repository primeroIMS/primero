import {
  connectRouter,
  routerMiddleware
} from "connected-react-router/immutable";
import { createBrowserHistory } from "history";
import { fromJS } from "immutable";
import { applyMiddleware, compose, createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";

import customMiddleware from "./middleware";
import rootReducer from "./reducer";

export const history = createBrowserHistory({
  basename: "v2"
});

export default () => {
  const preloadedState = fromJS({});

  const middleware = [
    routerMiddleware(history),
    thunkMiddleware,
    customMiddleware.restMiddleware({
      baseUrl: "/api/v2"
    }),
    customMiddleware.authMiddleware,
    customMiddleware.offlineMiddleware
  ];

  if (process.env.NODE_ENV === "development") {
    middleware.push(createLogger({ stateTransformer: state => state.toJS() }));
  }

  const composeEnhancers =
    process.env.NODE_ENV !== "development" ||
    typeof window !== "object" ||
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? compose
      : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          trace: true,
          traceLimit: 25
        });

  const store = createStore(
    combineReducers({
      router: connectRouter(history),
      ...rootReducer
    }),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
