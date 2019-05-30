import React from "react";
import { createMount } from "@material-ui/core/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { I18nProvider } from "libs";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { theme } from "config";

export const setupMountedComponent = (
  TestComponent,
  props = {},
  initialState = {}
) => {
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const component = createMount()(
    <Provider store={store}>
      <I18nProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <TestComponent {...props} />
          </MemoryRouter>
        </ThemeProvider>
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
