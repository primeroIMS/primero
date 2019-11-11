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
import { SnackbarProvider } from "notistack";
import { Form, Formik } from "formik";

export const setupMountedComponent = (
  TestComponent,
  props = {},
  initialState = {},
  initialEntries = [],
  formProps = {}
) => {
  const history = createBrowserHistory();
  const mockStore = configureStore([routerMiddleware(history), thunk]);
  const store = mockStore(initialState);

  const FormikComponent = ({ formikProps, componentProps }) => {
    if (isEmpty(formikProps)) {
      return <TestComponent {...componentProps} />;
    }
    return (
      <Formik {...formikProps}>
        <Form>
          <TestComponent {...componentProps} />
        </Form>
      </Formik>
    );
  };

  const RoutedProvider = () => {
    const formikComponentProps = {
      formikProps: formProps,
      componentProps: props
    };
    if (isEmpty(initialEntries)) {
      return (
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <FormikComponent {...formikComponentProps} />
          </MemoryRouter>
        </ThemeProvider>
      );
    }
    return (
      <ApplicationProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={initialEntries}>
            <FormikComponent {...formikComponentProps} />
          </MemoryRouter>
        </ThemeProvider>
      </ApplicationProvider>
    );
  };

  const component = createMount()(
    <Provider store={store}>
      <I18nProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SnackbarProvider>
            <RoutedProvider />
          </SnackbarProvider>
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
