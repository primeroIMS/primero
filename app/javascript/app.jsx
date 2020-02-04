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
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { SnackbarProvider } from "notistack";

import { theme, routes } from "./config";
import { I18nProvider } from "./components/i18n";
import NAMESPACE from "./components/i18n/namespace";
import { checkUserAuthentication } from "./components/user";
import { loginSystemSettings } from "./components/pages/login";
import { ApplicationProvider } from "./components/application";
import configureStore, { history } from "./store";
import ApplicationRoutes from "./components/application-routes";

import "./service-worker";

const store = configureStore();

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
  store.dispatch(loginSystemSettings());

  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <I18nProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ApplicationProvider>
                <ConnectedRouter history={history}>
                  <SnackbarProvider maxSnack={3}>
                    <ApplicationRoutes routes={routes} />
                  </SnackbarProvider>
                </ConnectedRouter>
              </ApplicationProvider>
            </MuiPickersUtilsProvider>
          </I18nProvider>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  );
};

App.displayName = "App";

export default App;
