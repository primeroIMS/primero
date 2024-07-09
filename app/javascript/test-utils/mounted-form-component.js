// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name, react/prop-types */

import capitalize from "lodash/capitalize";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, cloneElement } from "react";
import { render } from "@testing-library/react";

import { whichFormMode } from "../components/form";
import { FieldRecord } from "../components/record-form";

import { setupMountedComponent } from "./mounted-component";

const setupFormFieldRecord = (fieldRecord, field = {}) => {
  return fieldRecord({
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

function setupMockFormComponent({
  defaultValues,
  includeFormMethods,
  errors,
  includeFormProvider,
  state,
  additionalProps
}) {
  function MockFormComponent({ children, inputProps, field, mode }) {
    const formMethods = useForm({ defaultValues });
    const formMode = whichFormMode(mode || "new");

    const commonInputProps = setupFormInputProps(field, inputProps, mode, formMethods?.errors);

    const componentProps = {
      ...(includeFormMethods ? formMethods : {}),
      commonInputProps,
      ...inputProps,
      ...additionalProps
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
          {cloneElement(children, componentProps)}
        </FormProvider>
      );
    }

    return cloneElement(children, { formMode, formMethods, ...componentProps });
  }

  const { AppProviders, history, store } = setupMountedComponent({ state });

  function Providers({ children, ...rest }) {
    return (
      <AppProviders>
        <MockFormComponent {...children.props} {...rest}>
          {children}
        </MockFormComponent>
      </AppProviders>
    );
  }

  return { history, store, Providers };
}

function mountedFormComponent(
  Component,
  { state = {}, defaultValues = {}, includeFormMethods = false, includeFormProvider = false, errors, options = {} } = {}
) {
  const { history, store, Providers } = setupMockFormComponent({
    defaultValues,
    includeFormMethods,
    errors,
    includeFormProvider,
    state
  });

  const component = render(Component, {
    wrapper: Providers,
    ...options
  });

  return { ...component, history, store };
}

function mountedFieldComponent(
  Component,
  {
    fieldRecord = FieldRecord,
    fieldRecordSettings = {},
    inputProps = {},
    metaInputProps = {},
    mode = "new",
    errors,
    options
  } = {}
) {
  const field = setupFormFieldRecord(fieldRecord, fieldRecordSettings);

  const { history, store, Providers } = setupMockFormComponent({
    additionalProps: {
      inputProps,
      metaInputProps,
      field,
      mode
    },
    errors
  });

  const component = render(cloneElement(Component), {
    wrapper: props => <Providers {...props} mode={mode} field={field} inputProps={inputProps} />,
    ...options
  });

  return { ...component, history, store };
}

export { mountedFieldComponent, mountedFormComponent };
