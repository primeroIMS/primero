import ThemeProvider from "@material-ui/styles/ThemeProvider";
import createGenerateClassName from "@material-ui/styles/createGenerateClassName";
// import jssPreset from "@material-ui/styles/jssPreset";
import StylesProvider from "@material-ui/styles/StylesProvider";
import { ConnectedRouter } from "connected-react-router/immutable";
// import { create } from "jss";
// import rtl from "jss-rtl";
import React from "react";
import { Provider } from "react-redux";
import { theme } from "config";
import { I18nProvider } from "libs";
import { Route, Switch } from "react-router-dom";
import routes from "config/routes";
import NAMESPACE from "components/translations-toggle/namespace";
import configureStore, { history } from "./store";

const store = configureStore();

// const jss = create({
//   plugins: [...jssPreset().plugins, rtl()]
// });
const generateClassName = createGenerateClassName();

export default () => {
  store.subscribe(() => {
    document.querySelector("body").setAttribute(
      "dir",
      store
        .getState()
        .get(NAMESPACE)
        .get("themeDir")
    );
  });
  return (
    <Provider store={store}>
      <I18nProvider>
        <ThemeProvider theme={theme}>
          <StylesProvider injectFirst generateClassName={generateClassName}>
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
      </I18nProvider>
    </Provider>
  );
};
