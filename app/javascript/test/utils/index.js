/* eslint-disable react/display-name, react/no-multi-comp, react/prop-types */
import { routerMiddleware } from "connected-react-router/immutable";
import { Form, Formik } from "formik";
import { createMemoryHistory } from "history";
import isFunction from "lodash/isFunction";
import isEmpty from "lodash/isEmpty";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import DateFnsUtils from "@date-io/date-fns";
import { createMount } from "@material-ui/core/test-utils";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/core/styles";
import { useForm, FormProvider } from "react-hook-form";
import { fromJS } from "immutable";
import capitalize from "lodash/capitalize";
import { spy } from "sinon";
import { renderHook, act } from "@testing-library/react-hooks";

import { ApplicationProvider } from "../../components/application";
import I18nProvider from "../../components/i18n";
import { theme as appTheme, RECORD_PATH } from "../../config";
import { whichFormMode } from "../../components/form";
import { ListHeaderRecord } from "../../components/user/records";

const DEFAULT_STATE = fromJS({
  connectivity: {
    online: true,
    serverOnline: true
  }
});

const theme = appTheme();

const setupFormFieldRecord = (FieldRecord, field = {}) => {
  return FieldRecord({
    display_name: "Test Field 2",
    name: "test_field_2",
    type: "text_field",
    help_text: "Test Field 2 help text",
    required: true,
    autoFocus: true,
    ...field
  });
};

const setupFormInputProps = (field = {}, props = {}, mode, errors = []) => {
  const formMode = whichFormMode(props.mode);
  const error = errors?.[field.name];

  return {
    name: field.name,
    error: typeof error !== "undefined",
    required: field.required,
    autoFocus: field.autoFocus,
    autoComplete: "new-password",
    disabled: formMode.get(`is${capitalize(mode)}`),
    label: field.display_name,
    helperText: error?.message || field.help_text,
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    ...props
  };
};

export const createMockStore = (defaultState = fromJS({}), initialState) => {
  const history = createMemoryHistory();
  const mockStore = configureStore([routerMiddleware(history), thunk]);
  const store = mockStore(defaultState.merge(fromJS(initialState)));

  return { store, history };
};

export const setupMountedComponent = (
  TestComponent,
  props = {},
  initialState = {},
  initialEntries = [],
  formProps = {}
) => {
  const { store, history } = createMockStore(DEFAULT_STATE, initialState);

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
          <Router history={history}>
            <FormikComponent {...formikComponentProps} />
          </Router>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={initialEntries}>
          <FormikComponent {...formikComponentProps} />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  const component = createMount()(
    <Provider store={store}>
      <I18nProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SnackbarProvider>
            <ApplicationProvider>
              <RoutedProvider />
            </ApplicationProvider>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </I18nProvider>
    </Provider>
  );

  return { component, store };
};

export const setupMountedThemeComponent = (TestComponent, props = {}) =>
  createMount()(
    <ThemeProvider theme={theme}>
      <TestComponent {...props} />
    </ThemeProvider>
  );

export const tick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 100);
  });

export const setupMockFormComponent = (
  Component,
  {
    props = {},
    parentProps = {},
    state = {},
    defaultValues = {},
    includeFormMethods = false,
    includeFormProvider = false,
    errors
  } = {}
) => {
  const MockFormComponent = () => {
    const { inputProps, field, mode } = props;
    const formMethods = useForm({ defaultValues });
    const formMode = whichFormMode(mode || "new");

    const commonInputProps = setupFormInputProps(field, inputProps, mode, formMethods?.errors);

    const componentProps = {
      ...props,
      ...(includeFormMethods ? formMethods : {}),
      commonInputProps,
      ...inputProps
    };

    useEffect(() => {
      if (errors) {
        errors.forEach(error => {
          const { name, message } = error;

          formMethods.setError(name, { type: "manual", message });
        });
      }
    }, [errors]);

    if (includeFormProvider) {
      return (
        <FormProvider {...formMethods} formMode={formMode}>
          <Component {...componentProps} />
        </FormProvider>
      );
    }

    return <Component {...componentProps} formMode={formMode} formMethods={formMethods} />;
  };

  return setupMountedComponent(MockFormComponent, parentProps, state);
};

export const setupMockFieldComponent = (
  fieldComponent,
  FieldRecord,
  fieldRecordSettings = {},
  inputProps = {},
  metaInputProps = {},
  mode = "new",
  errors
) => {
  const field = setupFormFieldRecord(FieldRecord, fieldRecordSettings);

  return setupMockFormComponent(fieldComponent, {
    props: {
      inputProps,
      metaInputProps,
      field,
      mode
    },
    errors
  });
};

export const createSimpleMount = component => createMount()(component);

export const createMiddleware = (middleware, initialState) => {
  const { store } = createMockStore(fromJS({}), initialState);

  const next = spy();

  const invoke = action => middleware(store)(next)(action);

  return { store, next, invoke };
};

export const listHeaders = recordType => {
  const commonHeaders = [
    ListHeaderRecord({
      name: "description",
      field_name: "description",
      id_search: false
    })
  ];

  switch (recordType) {
    case RECORD_PATH.user_groups:
      return [
        ListHeaderRecord({
          name: "user_group.name",
          field_name: "name",
          id_search: false
        }),
        ...commonHeaders
      ];

    case RECORD_PATH.agencies:
      return [
        ListHeaderRecord({
          name: "agency.name",
          field_name: "name",
          id_search: false
        }),
        ...commonHeaders
      ];

    default:
      return [];
  }
};

export const lookups = () => ({
  data: [
    {
      unique_id: "lookup-1",
      name: { en: "Lookup 1" },
      values: [
        { id: "a", display_text: [{ en: "Lookup 1 a" }] },
        { id: "b", display_text: [{ en: "Lookup 1 b" }] }
      ]
    },
    {
      unique_id: "lookup-2",
      name: { en: "Lookup 2" },
      values: [
        { id: "a", display_text: [{ en: "Lookup 2 a" }] },
        { id: "b", display_text: [{ en: "Lookup 2 b" }] }
      ]
    }
  ],
  metadata: {
    total: 2,
    per: 1,
    page: 1
  }
});

export const translateOptions = (value, options, translations) => {
  const defaultLocale = window.I18n.defaultLocale || "en";

  if (isEmpty(options)) {
    return translations[defaultLocale][value];
  }

  let currValue = translations[options?.locale || defaultLocale][value];

  Object.entries(options).forEach(option => {
    const [optionKey, optionValue] = option;

    currValue = currValue.replace(optionKey, optionValue);
  });

  return currValue?.replace(/[^\w\s\'.]/gi, "");
};

export const abbrMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const setupHook = (hook, state = {}) => {
  const { store } = createMockStore(DEFAULT_STATE, fromJS(state));

  if (!hook && !isFunction(hook)) {
    throw new Error("Hook function not specified");
  }

  const result = renderHook(() => hook(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <I18nProvider>{children}</I18nProvider>
      </Provider>
    )
  });

  return { ...result, store, act };
};
