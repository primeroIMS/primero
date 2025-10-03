// Copyright (c) 2014 - 202 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupHook } from "../../test-utils";

import {
  TEXT_FIELD,
  SELECT_FIELD,
  PHOTO_FIELD,
  DOCUMENT_FIELD,
  CHECK_BOX_FIELD,
  RADIO_FIELD,
  TOGGLE_FIELD,
  DATE_FIELD,
  TICK_FIELD,
  SEPARATOR,
  DIALOG_TRIGGER,
  HIDDEN_FIELD,
  LINK_FIELD,
  ERROR_FIELD,
  LABEL_FIELD,
  ORDERABLE_OPTIONS_FIELD,
  PHOTO_RECORD_FIELD,
  AUDIO_RECORD_FIELD
} from "./constants";
import useFormField from "./use-form-field";

describe("useFormField", () => {
  const defaultFormMode = fromJS({
    isShow: false,
    isEdit: false,
    isNew: true
  });

  const defaultField = {
    name: "test_field",
    display_name: "Test Field",
    type: TEXT_FIELD,
    required: false,
    help_text: "Help text"
  };

  const formMode = { formMode: defaultFormMode };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Field component selection", () => {
    it("returns TextInput for default/unknown field types", () => {
      const { result } = setupHook(() => useFormField(defaultField, formMode));

      expect(result.current.Field.displayName).toBe("TextInput");
    });

    it("returns SwitchInput for TICK_FIELD", () => {
      const field = { ...defaultField, type: TICK_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("SwitchInput");
    });

    it("returns CheckboxInput for CHECK_BOX_FIELD", () => {
      const field = { ...defaultField, type: CHECK_BOX_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("CheckboxInput");
    });

    it("returns SelectInput for SELECT_FIELD", () => {
      const field = { ...defaultField, type: SELECT_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("SelectInput");
    });

    it("returns AttachmentInput for PHOTO_FIELD", () => {
      const field = { ...defaultField, type: PHOTO_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("AttachmentInput");
    });

    it("returns AttachmentInput for DOCUMENT_FIELD", () => {
      const field = { ...defaultField, type: DOCUMENT_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("AttachmentInput");
    });

    it("returns AttachmentInputArray for PHOTO_RECORD_FIELD", () => {
      const field = { ...defaultField, type: PHOTO_RECORD_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("AttachmentInputArray");
    });

    it("returns AttachmentInputArray for AUDIO_RECORD_FIELD", () => {
      const field = { ...defaultField, type: AUDIO_RECORD_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("AttachmentInputArray");
    });

    it("returns RadioInput for RADIO_FIELD", () => {
      const field = { ...defaultField, type: RADIO_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("RadioInput");
    });

    it("returns ToggleInput for TOGGLE_FIELD", () => {
      const field = { ...defaultField, type: TOGGLE_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("ToggleInput");
    });

    it("returns DateInput for DATE_FIELD", () => {
      const field = { ...defaultField, type: DATE_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("DateInput");
    });

    it("returns FieldOrderableOptions for ORDERABLE_OPTIONS_FIELD", () => {
      const field = { ...defaultField, type: ORDERABLE_OPTIONS_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("FieldOrderableOptions");
    });

    it("returns Seperator for SEPARATOR", () => {
      const field = { ...defaultField, type: SEPARATOR };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("Seperator");
    });

    it("returns DialogTrigger for DIALOG_TRIGGER", () => {
      const field = { ...defaultField, type: DIALOG_TRIGGER };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("DialogTrigger");
    });

    it("returns HiddenInput for HIDDEN_FIELD", () => {
      const field = { ...defaultField, type: HIDDEN_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("HiddenInput");
    });

    it("returns LinkField for LINK_FIELD", () => {
      const field = { ...defaultField, type: LINK_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("LinkField");
    });

    it("returns ErrorField for ERROR_FIELD", () => {
      const field = { ...defaultField, type: ERROR_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("ErrorField");
    });

    it("returns Label for LABEL_FIELD", () => {
      const field = { ...defaultField, type: LABEL_FIELD };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.Field.displayName).toBe("Label");
    });
  });

  describe("Error handling", () => {
    it("handles undefined errors", () => {
      const { result } = setupHook(() => useFormField(defaultField, { formMode: defaultFormMode, errors: undefined }));

      expect(result.current.error).toBeUndefined();
    });

    it("handles regular field errors", () => {
      const errors = { test_field: { message: "Field is required" } };
      const { result } = setupHook(() => useFormField(defaultField, { formMode: defaultFormMode, errors }));

      expect(result.current.error).toEqual({ message: "Field is required" });
    });

    it("handles DOCUMENT_FIELD errors with base64 suffix", () => {
      const field = { ...defaultField, type: DOCUMENT_FIELD };
      const errors = { test_field_base64: { message: "Invalid file format" } };
      const { result } = setupHook(() => useFormField(field, { formMode: defaultFormMode, errors }));

      expect(result.current.error).toEqual({ message: "Invalid file format" });
    });

    it("prioritizes base64 errors over regular field errors for DOCUMENT_FIELD", () => {
      const field = { ...defaultField, type: DOCUMENT_FIELD };
      const errors = {
        test_field: { message: "Regular error" },
        test_field_base64: { message: "Base64 error" }
      };
      const { result } = setupHook(() => useFormField(field, { formMode: defaultFormMode, errors }));

      expect(result.current.error).toEqual({ message: "Base64 error" });
    });
  });

  describe("Common input props", () => {
    it("generates correct common input props", () => {
      const field = {
        ...defaultField,
        required: true,
        autoFocus: true,
        placeholder: "Enter value"
      };
      const { result } = setupHook(() => useFormField(field, formMode));

      const { commonInputProps } = result.current;

      expect(commonInputProps).toMatchObject({
        id: "test_field",
        name: "test_field",
        required: true,
        autoFocus: true,
        placeholder: "Enter value",
        fullWidth: true,
        disabled: false,
        error: false,
        label: "Test Field",
        helperText: "Help text"
      });
    });

    it("disables input in show mode", () => {
      const showMode = fromJS({ isShow: true, isEdit: false, isNew: false });
      const { result } = setupHook(() => useFormField(defaultField, { formMode: showMode }));

      expect(result.current.commonInputProps.disabled).toBe(true);
    });

    it("disables input when disabled prop is true", () => {
      const field = { ...defaultField, disabled: true };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.commonInputProps.disabled).toBe(true);
    });

    it("disables input in edit mode when editable is false", () => {
      const editMode = fromJS({ isShow: false, isEdit: true, isNew: false });
      const field = { ...defaultField, editable: false };
      const { result } = setupHook(() => useFormField(field, { formMode: editMode }));

      expect(result.current.commonInputProps.disabled).toBe(true);
    });

    it("enables input in edit mode when editable is true", () => {
      const editMode = fromJS({ isShow: false, isEdit: true, isNew: false });
      const field = { ...defaultField, editable: true };
      const { result } = setupHook(() => useFormField(field, { formMode: editMode }));

      expect(result.current.commonInputProps.disabled).toBe(false);
    });
  });

  describe("Meta input props", () => {
    it("includes all meta input properties", () => {
      const field = {
        ...defaultField,
        multi_select: true,
        numeric: true,
        password: true,
        freeSolo: true,
        tooltip: "Tooltip text"
      };
      const { result } = setupHook(() => useFormField(field, formMode));

      const { metaInputProps } = result.current;

      expect(metaInputProps).toMatchObject({
        type: TEXT_FIELD,
        multiSelect: true,
        numeric: true,
        password: true,
        freeSolo: true,
        tooltip: "Tooltip text"
      });
    });
  });

  describe("Option selector", () => {
    it("creates option selector with correct properties", () => {
      const field = {
        ...defaultField,
        option_strings_source: "lookup-test",
        options: ["option1", "option2"],
        option_strings_source_id_key: "id",
        rawOptions: true
      };
      const { result } = setupHook(() => useFormField(field, formMode));

      const watchedInputsValues = { test: "value" };
      const optionSelector = result.current.optionSelector(watchedInputsValues);

      expect(optionSelector).toMatchObject({
        source: "lookup-test",
        options: ["option1", "option2"],
        optionStringsSourceIdKey: "id",
        rawOptions: true
      });
    });

    it("handles filter options when filterOptionSource is provided", () => {
      const filterOptionSource = jest.fn(() => ["filtered"]);
      const field = {
        ...defaultField,
        filterOptionSource
      };
      const { result } = setupHook(() => useFormField(field, formMode));

      const watchedInputsValues = { test: "value" };
      const optionSelector = result.current.optionSelector(watchedInputsValues);

      expect(optionSelector.filterOptions).toBeDefined();
      expect(typeof optionSelector.filterOptions).toBe("function");

      // Test the filter function
      const optionsFromState = ["option1", "option2"];
      const filteredOptions = optionSelector.filterOptions(optionsFromState);

      expect(filterOptionSource).toHaveBeenCalledWith(watchedInputsValues, optionsFromState);
      expect(filteredOptions).toEqual(["filtered"]);
    });
  });

  describe("Visibility handling", () => {
    it("handles showIf visibility in non-show mode", () => {
      const showIf = jest.fn(() => true);
      const field = { ...defaultField, showIf };
      const { result } = setupHook(() => useFormField(field, formMode));

      const watchedInputsValues = { test: "value" };
      const isVisible = !result.current.handleVisibility(watchedInputsValues);

      expect(showIf).toHaveBeenCalledWith(watchedInputsValues);
      expect(isVisible).toBe(true);
    });

    it("handles forceShowIf visibility", () => {
      const showIf = jest.fn(() => false);
      const field = { ...defaultField, showIf, forceShowIf: true };
      const { result } = setupHook(() => useFormField(field, formMode));

      const watchedInputsValues = { test: "value" };
      const isVisible = !result.current.handleVisibility(watchedInputsValues);

      expect(showIf).toHaveBeenCalledWith(watchedInputsValues);
      expect(isVisible).toBe(false);
    });

    it("handles hideOnShow in show mode", () => {
      const showMode = fromJS({ isShow: true, isEdit: false, isNew: false });
      const field = { ...defaultField, hideOnShow: true };
      const { result } = setupHook(() => useFormField(field, { formMode: showMode }));

      const watchedInputsValues = { test: "value" };
      const shouldHide = result.current.handleVisibility(watchedInputsValues);

      expect(shouldHide).toBe(true);
    });

    it("handles visible prop through isNotVisible", () => {
      const field = { ...defaultField, visible: false };
      const { result } = setupHook(() => useFormField(field, formMode));

      const isNotVisible = result.current.isNotVisible({});

      expect(isNotVisible).toBe(true);
    });

    it("handles watched visible prop through isNotVisible", () => {
      const { result } = setupHook(() => useFormField(defaultField, formMode));

      const isNotVisible = result.current.isNotVisible({ visible: false });

      expect(isNotVisible).toBe(true);
    });
  });

  describe("Date format handling", () => {
    it("uses DATE_TIME_FORMAT when dateIncludeTime is true", () => {
      const field = { ...defaultField, date_include_time: true };
      const { result } = setupHook(() => useFormField(field, formMode));

      expect(result.current.commonInputProps.format).toBe("dd-MMM-yyyy HH:mm");
    });

    it("uses DATE_FORMAT when dateIncludeTime is false", () => {
      const field = { ...defaultField, date_include_time: false };
      const { result } = setupHook(() => useFormField(field, { formMode: defaultFormMode }));

      expect(result.current.commonInputProps.format).toBe("dd-MMM-yyyy");
    });
  });

  describe("Error checking", () => {
    it("handles checkErrors with field errors", () => {
      const checkErrors = ["test_field"];
      const errors = { test_field: { message: "Error" } };
      const { result } = setupHook(() =>
        useFormField(defaultField, { formMode: defaultFormMode, checkErrors, errors })
      );

      expect(result.current.commonInputProps.error).toBe(true);
    });

    it("handles fieldCheckErrors", () => {
      const field = { ...defaultField, check_errors: ["test_field"] };
      const { result } = setupHook(() => useFormField(field, { formMode: defaultFormMode }));

      expect(result.current.errorsToCheck).toEqual(["test_field"]);
    });

    it("combines checkErrors and fieldCheckErrors", () => {
      const checkErrors = ["global_error"];
      const field = { ...defaultField, check_errors: ["field_error"] };
      const { result } = setupHook(() => useFormField(field, { formMode: defaultFormMode, checkErrors }));

      expect(result.current.errorsToCheck).toEqual(["global_error", "field_error"]);
    });
  });
});
