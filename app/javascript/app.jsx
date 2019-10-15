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
import { theme } from "config";
import { I18nProvider } from "components/i18n";
import { Route, Switch, Redirect } from "react-router-dom";
import routes from "config/routes";
import NAMESPACE from "components/i18n/namespace";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { checkUserAuthentication } from "components/user";
import { SnackbarProvider } from "notistack";
import { ApplicationProvider } from "components/application";
import configureStore, { history } from "./store";

const store = configureStore();

window.I18n = { defaultLocale: "en", locale: "en", t: path => path };

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: document.getElementById("jss-insertion-point")
});

const generateClassName = createGenerateClassName();

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
                      <Route exact path="/">
                        <Redirect to="/login" />
                      </Route>
                      {routes.map((route, index) => {
                        if (route.layout) {
                          return (
                            <Route
                              key={index}
                              exact={
                                route.routes
                                  ? route.routes.some(r => r.exact)
                                  : route.exact
                              }
                              path={route.routes.map(r => r.path)}
                            >
                              <route.layout>
                                {route.routes.map(subRoute => (
                                  <Route
                                    key={subRoute.path}
                                    exact
                                    path={subRoute.path}
                                    component={() => (
                                      <subRoute.component
                                        mode={subRoute.mode}
                                      />
                                    )}
                                  />
                                ))}
                              </route.layout>
                            </Route>
                          );
                        }

                        return <Route key={index} {...route} />;
                      })}
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
