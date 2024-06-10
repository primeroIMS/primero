// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ConnectedRouter } from "connected-react-router/immutable";
import { Provider } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { useLayoutEffect } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

import Translations from "./db/collections/translations";
import I18nProvider from "./components/i18n";
import { ApplicationProvider } from "./components/application";
import { routes } from "./config";
import { history } from "./store";
import ApplicationRoutes from "./components/application-routes";
import ThemeProvider from "./theme-provider";
import "mui-nepali-datepicker-reactjs/dist/index.css";
import appInit from "./app-init";

const { store } = appInit();

const App = () => {
  window.I18n.fallbacks = true;

  useLayoutEffect(() => {
    const loadTranslations = async () => {
      if (isEmpty(window.I18n.translations)) {
        const translations = await Translations.find();

        window.I18n.translations = translations;
      } else {
        Translations.save(window.I18n.translations);
      }
    };

    loadTranslations();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ApplicationProvider>
              <ConnectedRouter history={history}>
                <ApplicationRoutes routes={routes} />
              </ConnectedRouter>
            </ApplicationProvider>
          </LocalizationProvider>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
};

App.displayName = "App";

export default App;
