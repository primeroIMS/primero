import { routerMiddleware } from "connected-react-router/immutable";
import { Form, Formik } from "formik";
import { createBrowserHistory } from "history";
import { isEmpty } from "lodash";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { expect } from "chai";
import { spy, useFakeTimers, stub } from "sinon";
import DateFnsUtils from "@date-io/date-fns";
import { createMount } from "@material-ui/core/test-utils";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import useForm, { FormContext } from "react-hook-form";

import { ApplicationProvider } from "../components/application/provider";
import { I18nProvider } from "../components/i18n";
import { theme } from "../config";

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

export const tick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 0);
  });

const setupFormFieldRecord = (FieldRecord, field = {}) => {
  return FieldRecord(
    Object.assign(
      {},
      {
        display_name: "Test Field 2",
        name: "test_field_2",
        type: "text_field",
        help_text: "Test Field 2 help text",
        required: true,
        autoFocus: true
      },
      field
    )
  );
};

const setupFormInputProps = (field = {}, props = {}) => {
  return Object.assign(
    {},
    {
      label: field.display_name,
      helperText: field.help_text,
      fullWidth: true,
      autoComplete: "off",
      InputLabelProps: {
        shrink: true
      }
    },
    props
  );
};

export const setupMockFormComponent = (Component, props) => {
  const MockFormComponent = () => {
    const formMethods = useForm();

    return (
      <FormContext {...formMethods}>
        <Component {...props} />
      </FormContext>
    );
  };

  return setupMountedComponent(MockFormComponent);
};

export const setupMockFieldComponent = (
  fieldComponent,
  FieldRecord,
  fieldRecordSettings = {},
  inputProps = {}
) => {
  const field = setupFormFieldRecord(FieldRecord, fieldRecordSettings);
  const commonInputProps = setupFormInputProps(field, inputProps);

  return setupMockFormComponent(fieldComponent, {
    commonInputProps,
    field
  });
};

export { expect, spy, useFakeTimers, stub };
