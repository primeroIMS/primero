// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name, react/prop-types */
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import isEmpty from "lodash/isEmpty";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { Form, Formik, useFormikContext } from "formik";

import { ApplicationProvider } from "../components/application";
import I18nProvider from "../components/i18n/provider";
import ThemeProvider from "../theme-provider";

import { createMockStore, DEFAULT_STATE } from "./create-mock-store";

const FormikValueFromHook = () => {
  return null;
};

const FormikForm = ({ children }) => {
  const formContext = useFormikContext();

  return (
    <Form>
      <FormikValueFromHook {...formContext} />
      {children}
    </Form>
  );
};

function mountedComponent(Component, state = {}, options = {}, initialEntries = [], formProps = {}, path = "") {
  const { store, history } = createMockStore(DEFAULT_STATE, state);

  function FormProvider({ children }) {
    if (isEmpty(formProps)) {
      return children;
    }

    return (
      <Formik {...formProps}>
        <FormikForm>{children}</FormikForm>
      </Formik>
    );
  }

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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <SnackbarProvider>
              <ApplicationProvider>
                <ThemeProvider>
                  <RouteProvider>
                    <FormProvider>{children}</FormProvider>
                  </RouteProvider>
                </ThemeProvider>
              </ApplicationProvider>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </I18nProvider>
      </Provider>
    );
  }

  const component = render(Component, {
    wrapper: AppProviders,
    ...options
  });

  return { ...component, history, store };
}

export default mountedComponent;

export { FormikValueFromHook };
