// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name, react/prop-types */
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import isEmpty from "lodash/isEmpty";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { ApplicationProvider } from "../components/application";
import I18nProvider from "../components/i18n/provider";
import ThemeProvider from "../theme-provider";

import { createMockStore, DEFAULT_STATE } from "./create-mock-store";
import { FormikProvider } from "./formik-utils";

function setupMountedComponent({ state, path, initialEntries, formProps, includeRestMiddleware } = {}) {
  const { store, history } = createMockStore(DEFAULT_STATE, state, includeRestMiddleware);

  function RouteProvider({ children }) {
    if (isEmpty(initialEntries)) {
      return <Router history={history}>{children}</Router>;
    }

    return (
      <MemoryRouter initialEntries={initialEntries}>
        <Route path={path}>{children}</Route>
      </MemoryRouter>
    );
  }

  function AppProviders({ children }) {
    return (
      <Provider store={store}>
        <I18nProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider>
              <ApplicationProvider>
                <ThemeProvider>
                  <RouteProvider>
                    <FormikProvider formProps={formProps}>{children}</FormikProvider>
                  </RouteProvider>
                </ThemeProvider>
              </ApplicationProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </I18nProvider>
      </Provider>
    );
  }

  return { store, history, AppProviders };
}

function mountedComponent(
  Component,
  state = {},
  options = {},
  initialEntries = [],
  formProps = {},
  path = "",
  includeRestMiddleware = false
) {
  const { store, history, AppProviders } = setupMountedComponent({
    state,
    path,
    formProps,
    initialEntries,
    includeRestMiddleware
  });

  const component = render(Component, {
    wrapper: AppProviders,
    ...options
  });

  return { ...component, history, store };
}

export default mountedComponent;

export { setupMountedComponent };
