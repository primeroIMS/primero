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
import * as CasesList from "components/pages/case-list";
import * as TracingRequestList from "components/pages/tracing-request-list";
import * as IncidentList from "components/pages/incident-list";
import * as Nav from "components/nav";
import * as Login from "components/pages/login";
import * as TranslationToogle from "components/translations-toggle";
import * as Dashboard from "./components/pages/dashboard";

// TODO: Temporarily setting basename
export const history = createBrowserHistory({
  basename: "v2"
});

export default () => {
  const preloadedState = Map();

  const middleware = [
    routerMiddleware(history),
    restMiddleware({
      baseUrl: "/api/v2"
    }),
    thunkMiddleware
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
      ...Dashboard.dashboardReducers,
      ...CasesList.reducers,
      ...TracingRequestList.reducers,
      ...IncidentList.reducers,
      ...Nav.reducers,
      ...Login.reducers,
      ...TranslationToogle.reducers
    }),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
