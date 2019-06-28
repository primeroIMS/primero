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

import * as I18n from "components/i18n";
import * as CasesList from "components/pages/case-list";
import * as TracingRequestList from "components/pages/tracing-request-list";
import * as IncidentList from "components/pages/incident-list";
import * as Nav from "components/nav";
import * as Login from "components/pages/login";
import * as Dashboard from "./components/pages/dashboard";
import * as Filter from "./components/filters";
import * as FiltersBuilder from "./components/filters-builder";
import * as Filters from "./components/filters-builder/filter-controls";

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
      records: combineReducers({
        ...CasesList.reducers,
        ...TracingRequestList.reducers,
        ...IncidentList.reducers,
        ...Dashboard.reducers
      }),
      filters: combineReducers({
        ...Filter.reducers,
        ...FiltersBuilder.reducers,
        ...Filters.chipsReducer,
        ...Filters.radioButtonsReducer,
        ...Filters.rangeButtonReducer,
        ...Filters.selectReducer,
        ...Filters.checkboxReducer
      }),
      ui: combineReducers({ ...Nav.reducers, ...I18n.reducers }),
      ...Login.reducers
    }),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );
  return store;
};
