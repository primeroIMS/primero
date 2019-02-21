import { routerMiddleware } from "connected-react-router/immutable";
import { createBrowserHistory } from "history";
import { Map } from "immutable";
import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from 'redux-logger';
import rootReducer from "./reducers";

// TODO: Temporarily setting basename
export const history = createBrowserHistory({
  basename: "v2"
});

export default () => {
  const preloadedState = Map();

  let middleware = [routerMiddleware(history)];

  if ("development" === process.env.NODE_ENV ) {
    middleware.push(createLogger({ stateTransformer: state => state.toJS() }));
  }

  const composeEnhancers =
    "development" !== process.env.NODE_ENV ||
    "object" !== typeof window ||
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? compose
      : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const store = createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
