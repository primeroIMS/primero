import ThemeProvider from "@material-ui/styles/ThemeProvider";
import createGenerateClassName from "@material-ui/styles/createGenerateClassName";
import jssPreset from "@material-ui/styles/jssPreset";
import StylesProvider from "@material-ui/styles/StylesProvider";
import { ConnectedRouter } from "connected-react-router/immutable";
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
import { LoginLayoutRoute, AppLayoutRoute } from "components/layouts";
import { checkAuthentication } from "components/pages/login";
import configureStore, { history } from "./store";

const store = configureStore();

const jss = create({
  plugins: [...jssPreset().plugins, rtl()]
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

  store.dispatch(checkAuthentication());

  return (
    <Provider store={store}>
      <I18nProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={theme}>
            <StylesProvider
              injectFirst
              jss={jss}
              generateClassName={generateClassName}
            >
              <ConnectedRouter history={history}>
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/login" />
                  </Route>
                  {routes.map(route => {
                    if (route.layout === "LoginLayout") {
                      return route.routes.map(loginLayout => (
                        <LoginLayoutRoute {...loginLayout} />
                      ));
                    }
                    return route.routes.map(appLayout => (
                      <AppLayoutRoute {...appLayout} />
                    ));
                  })}
                </Switch>
              </ConnectedRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </I18nProvider>
    </Provider>
  );
};

export default App;
