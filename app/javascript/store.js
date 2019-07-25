import {
  routerMiddleware,
  connectRouter
} from "connected-react-router/immutable";
import { Map } from "immutable";
import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { connectivityMiddleware, offlineEncryptionMiddleware, offlineMiddleware } from "./offline";
import { restMiddleware } from "middleware";
import { createBrowserHistory } from "history";
import { combineReducers } from "redux-immutable";
import rootReducer from "./reducers";

export const history = createBrowserHistory({
  basename: "v2"
});

export default () => {
  const preloadedState = Map();

  const middleware = [
    routerMiddleware(history),
    thunkMiddleware,
    connectivityMiddleware,
    offlineEncryptionMiddleware,
    offlineMiddleware,
    restMiddleware({
      baseUrl: "/api/v2"
    })
  ];

  if (process.env.NODE_ENV === "development") {
    middleware.push(createLogger({ stateTransformer: state => state.toJS() }));
  }

  const composeEnhancers =
    process.env.NODE_ENV !== "development" ||
    typeof window !== "object" ||
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? compose
      : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

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
