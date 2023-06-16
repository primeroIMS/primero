/* eslint-disable react/no-multi-comp, react/display-name, react/prop-types */

import capitalize from "lodash/capitalize";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";

import { whichFormMode } from "../components/form";

import mountedComponent from "./mounted-component";

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

const setupMockFormComponent = (
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

  return mountedComponent(<MockFormComponent {...parentProps} />, state);
};

const setupMockFieldComponent = (
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

export { setupMockFieldComponent, setupMockFormComponent };
