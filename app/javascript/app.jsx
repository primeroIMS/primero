/* eslint-disable react/no-array-index-key */

import ThemeProvider from "@material-ui/styles/ThemeProvider";
import createGenerateClassName from "@material-ui/styles/createGenerateClassName";
import jssPreset from "@material-ui/styles/jssPreset";
import StylesProvider from "@material-ui/styles/StylesProvider";
import { ConnectedRouter } from "connected-react-router/immutable";
import CssBaseline from "@material-ui/core/CssBaseline";
import { create } from "jss";
import rtl from "jss-rtl";
import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { SnackbarProvider } from "notistack";

import { theme, PERMITTED_URL } from "./config";
import { I18nProvider } from "./components/i18n";
import routes from "./config/routes";
import NAMESPACE from "./components/i18n/namespace";
import { checkUserAuthentication } from "./components/user";
import { loginSystemSettings } from "./components/pages/login";
import { ApplicationProvider } from "./components/application";
import Permission from "./components/application/permission";
import configureStore, { history } from "./store";

const store = configureStore();

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: document.getElementById("jss-insertion-point")
});

const generateClassName = createGenerateClassName();

const routesApplication = routes.map((route, index) => {
  if (route.layout) {
    const subRouteApplication = route.routes.map(subRoute => {
      const subRouteComponent = () =>
        PERMITTED_URL.includes(subRoute.path) ? (
          <subRoute.component mode={subRoute.mode} />
        ) : (
            <Permission
              resources={subRoute.resources}
              actions={subRoute.actions}
              redirect
            >
              <subRoute.component mode={subRoute.mode} />
            </Permission>
          );

      return (
        <Route
          key={subRoute.path}
          exact
          path={subRoute.path}
          component={subRouteComponent}
        />
      );
    });

    return (
      <Route
        key={index}
        exact={route.routes ? route.routes.some(r => r.exact) : route.exact}
        path={route.routes.map(r => r.path)}
      >
        <route.layout>{subRouteApplication}</route.layout>
      </Route>
    );
  }

  return <Route key={index} {...route} />;
});

const App = () => {
  store.subscribe(() => {
    document.querySelector("body").setAttribute(
      "dir",
      store
        .getState()
        .get("ui")
        .get(NAMESPACE)
        .get("dir")
    );
  });

  store.dispatch(checkUserAuthentication());
  store.dispatch(loginSystemSettings());

  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <I18nProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <SnackbarProvider maxSnack={3}>
                <ApplicationProvider>
                  <ConnectedRouter history={history}>
                    <Switch>
                      {routesApplication}
                    </Switch>
                  </ConnectedRouter>
                </ApplicationProvider>
              </SnackbarProvider>
            </MuiPickersUtilsProvider>
          </I18nProvider>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default App;
