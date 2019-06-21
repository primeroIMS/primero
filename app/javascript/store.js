import {
  connectRouter,
  routerMiddleware
} from "connected-react-router/immutable";
import { createBrowserHistory } from "history";
import { Map } from "immutable";
import { applyMiddleware, compose, createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { restMiddleware } from "middleware";
import * as CasesList from "./components/pages/case-list";
import * as Nav from "./components/nav";
import * as LoginPage from "./components/pages/login";
import * as TranslationToogle from "./components/translations-toggle";

// TODO: Temporarily setting basename
export const history = createBrowserHistory({
  basename: "v2"
});

export default () => {
  const preloadedState = Map();

  const middleware = [
    routerMiddleware(history),
    thunkMiddleware,
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
      records: combineReducers({ ...CasesList.reducers }),
      ui: combineReducers({ ...Nav.reducers }),
      ...LoginPage.loginReducers,
      ...TranslationToogle.reducers
    }),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
