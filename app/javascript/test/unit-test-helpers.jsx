import React from "react";
import { createMount } from "@material-ui/core/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import DateFnsUtils from "@date-io/date-fns";
import { I18nProvider } from "components/i18n";
import { isEmpty } from "lodash";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { theme } from "config";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router/immutable";
import { ApplicationProvider } from "components/application/provider";

export const setupMountedComponent = (
  TestComponent,
  props = {},
  initialState = {},
  initialEntries = []
) => {
  const history = createBrowserHistory();
  const mockStore = configureStore([routerMiddleware(history), thunk]);
  const store = mockStore(initialState);

  const RoutedProvider = () => {
    if (isEmpty(initialEntries)) {
      return (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <TestComponent {...props} />
          </MemoryRouter>
        </ThemeProvider>
      );
    }
    return (
      <ApplicationProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={initialEntries}>
            <TestComponent {...props} />
          </MemoryRouter>
        </ThemeProvider>
      </ApplicationProvider>
    );
  };

  const component = createMount()(
    <Provider store={store}>
      <I18nProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <RoutedProvider />
        </MuiPickersUtilsProvider>
      </I18nProvider>
    </Provider>
  );

  return {
    component
  };
};

export const setupMountedThemeComponent = (TestComponent, props = {}) =>
  createMount()(
    <ThemeProvider theme={theme}>
      <TestComponent {...props} />
    </ThemeProvider>
  );
