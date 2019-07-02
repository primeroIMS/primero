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
import { Route, Switch } from "react-router-dom";
import routes from "config/routes";
import NAMESPACE from "components/i18n/namespace";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
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
                  {routes.map(route => (
                    <Route
                      key={route.path}
                      path={route.path}
                      render={props => (
                        <route.component {...props} route={route} />
                      )}
                    />
                  ))}
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
