import { MuiThemeProvider } from "@material-ui/core";
import { createGenerateClassName, jssPreset } from "@material-ui/styles";
import { ConnectedRouter } from "connected-react-router/immutable";
import { create } from "jss";
import rtl from "jss-rtl";
import React from "react";
import JssProvider from "react-jss/lib/JssProvider";
import { Provider } from "react-redux";
import { AppLayout } from "components/layouts";
import { theme } from "./config";
import { I18nProvider } from "./libs/i18n";
import configureStore, { history } from "./store";

const store = configureStore();

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const generateClassName = createGenerateClassName();

export default () => {
  return (
    <Provider store={store}>
      <I18nProvider>
        <MuiThemeProvider theme={theme}>
          <JssProvider jss={jss} generateClassName={generateClassName}>
            <ConnectedRouter history={history}>
              <AppLayout />
            </ConnectedRouter>
          </JssProvider>
        </MuiThemeProvider>
      </I18nProvider>
    </Provider>
  );
};
