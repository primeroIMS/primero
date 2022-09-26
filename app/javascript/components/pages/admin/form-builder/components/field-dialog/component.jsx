/* eslint-disable camelcase */
import { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { batch, useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { fromJS } from "immutable";
import Add from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import get from "lodash/get";
import set from "lodash/set";
import { yupResolver } from "@hookform/resolvers/yup";

import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { RADIO_FIELD, SELECT_FIELD, submitHandler, whichFormMode } from "../../../../../form";
import { useI18n } from "../../../../../i18n";
import { getObjectPath, displayNameHelper, useMemoizedSelector, reduceMapToObject } from "../../../../../../libs";
import { getSelectedField, getSelectedFields, getSelectedSubform, getSelectedSubformField } from "../../selectors";
import {
  createSelectedField,
  clearSelectedSubformField,
  clearSelectedSubform,
  updateSelectedField,
  updateSelectedSubform,
  setNewSubform,
  clearSelectedField
} from "../../action-creators";
import FieldsForm from "../fields-form";
import SubformFieldsList from "../subform-fields-list";
import ClearButtons from "../clear-buttons";
import { NEW_FIELD } from "../../constants";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";
import { getOptions } from "../../../../../record-form/selectors";
import { getLabelTypeField } from "../utils";
import FieldTranslationsDialog, { NAME as FieldTranslationsDialogName } from "../field-translations-dialog";
import { SUBFORM_GROUP_BY, SUBFORM_SECTION_CONFIGURATION, SUBFORM_SORT_BY } from "../field-list-item/constants";
import FieldDialogLabel from "../field-dialog-label";
import { useApp } from "../../../../../application";
import { conditionsToFieldArray, fieldArrayToConditions } from "../../utils";
import SkipLogic from "../skip-logic";
import { NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

import css from "./styles.css";
import {
  disableOptionStringsText,
  getFormField,
  getUpdatedSubform,
  isSubformField,
  setInitialForms,
  setSubformData,
  subformContainsFieldName,
  transformValues,
  toggleHideOnViewPage,
  buildDataToSave,
  generateUniqueId,
  mergeTranslationKeys
} from "./utils";
import { NAME, ADMIN_FIELDS_DIALOG, FIELD_FORM, RESET_OPTIONS, SKIP_LOGIC_FIELD } from "./constants";

const Component = ({ formId, mode, onClose, onSuccess, parentForm, primeroModule, recordType }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { limitedProductionSite } = useApp();

  const { dialogOpen, dialogClose, setDialog } = useDialog([
    ADMIN_FIELDS_DIALOG,
    FieldTranslationsDialogName,
    CONDITIONS_DIALOG
  ]);

  const selectedField = useMemoizedSelector(state => getSelectedField(state));
  const selectedIsSubformField = isSubformField(selectedField);

  const selectedSubformField = useMemoizedSelector(state => getSelectedSubformField(state));
  const selectedSubform = useMemoizedSelector(state => getSelectedSubform(state));
  const lastField = useMemoizedSelector(state => getSelectedFields(state, false))?.last();
  const lookups = useMemoizedSelector(state => getOptions(state));

  const selectedFieldName = selectedField?.get("name");

  const isNested = subformContainsFieldName(selectedSubform, selectedFieldName, selectedSubformField);
  const { forms: fieldsForm, validationSchema } = getFormField({
    field: selectedField,
    parentForm,
    i18n,
    formMode,
    css,
    lookups,
    isNested,
    onManageTranslations: () => {
      setDialog({ dialog: FieldTranslationsDialogName, open: true });
    },
    limitedProductionSite
  });
  const formMethods = useForm({ resolver: yupResolver(validationSchema), shouldUnregister: false, mode: "onSubmit" });
  const {
    control,
    reset,
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { dirtyFields }
  } = formMethods;

  const skipLogic = useWatch({ control: formMethods.control, name: `${selectedFieldName}.${SKIP_LOGIC_FIELD}` });

  const parentFieldName = selectedField?.get("name", "");

  const subformSortBy = useWatch({
    control,
    name: `${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${SUBFORM_SORT_BY}`
  });
  const subformGroupBy = useWatch({
    control,
    name: `${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${SUBFORM_GROUP_BY}`
  });

  const openFieldDialog = dialogOpen[ADMIN_FIELDS_DIALOG];
  const openTranslationDialog = dialogOpen[FieldTranslationsDialogName];
  const openSkipLogicDialog = dialogOpen[CONDITIONS_DIALOG];

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }

    if (selectedSubform.toSeq().size && !isNested) {
      dispatch(clearSelectedSubform());
    }

    if (selectedSubform.toSeq().size && isNested) {
      if (selectedFieldName === NEW_FIELD) {
        dialogClose();
      }
      dispatch(clearSelectedSubformField());
    } else {
      dialogClose();
    }

    if (selectedFieldName === NEW_FIELD) {
      setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true });
    }
  }, [selectedSubform, selectedFieldName, isNested]);

  const backToFieldDialog = useCallback(() => {
    setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true });
  }, []);

  const editDialogTitle = selectedIsSubformField
    ? (selectedSubform.get("name") && displayNameHelper(selectedSubform.get("name"), i18n.locale)) || ""
    : i18n.t("fields.edit_label");

  const dialogTitle = formMode.get("isEdit")
    ? editDialogTitle
    : i18n.t("fields.add_field_type", {
        file_type: i18n.t(`fields.${getLabelTypeField(selectedField)}`)
      });

  const confirmButtonLabel = formMode.get("isEdit") ? i18n.t("buttons.update") : i18n.t("buttons.add");
  const confirmButtonIcon = formMode.get("isNew") ? <Add /> : <CheckIcon />;

  const isFieldDialogOpen = openFieldDialog || openTranslationDialog || openSkipLogicDialog;

  const modalProps = {
    confirmButtonLabel,
    confirmButtonProps: {
      icon: confirmButtonIcon,
      form: FIELD_FORM,
      type: "submit"
    },
    dialogTitle,
    open: isFieldDialogOpen,
    cancelHandler: handleClose,
    omitCloseAfterSuccess: true,
    showSuccessButton: !limitedProductionSite
  };

  const addOrUpdatedSelectedField = fieldData => {
    let newFieldData = fieldData;
    const subformUniqueId = selectedSubform?.get("unique_id");
    const subformTempId = selectedSubform?.get("temp_id");
    const currentFieldName = selectedFieldName === NEW_FIELD ? Object.keys(fieldData)[0] : selectedFieldName;

    if (typeof fieldData[currentFieldName].disabled !== "undefined" || selectedFieldName === NEW_FIELD) {
      newFieldData = { [currentFieldName]: { ...fieldData[currentFieldName] } };
      getObjectPath("", newFieldData)
        .filter(path => path.endsWith("disabled"))
        .forEach(path => {
          set(newFieldData, path, !get(newFieldData, path));
        });
    }

    if (selectedFieldName === NEW_FIELD) {
      if ((subformUniqueId || subformTempId) && !selectedSubformField.size <= 0) {
        dispatch(updateSelectedField(newFieldData, subformUniqueId || subformTempId));
        dispatch(clearSelectedSubformField());
      } else {
        // Overrides subform_section_temp_id if it's not an existing subform
        dispatch(
          createSelectedField(
            subformTempId
              ? {
                  [currentFieldName]: {
                    ...newFieldData[currentFieldName],
                    subform_section_temp_id: subformTempId,
                    subform_section_unique_id: generateUniqueId(selectedFieldName)
                  }
                }
              : newFieldData
          )
        );
      }
    } else {
      const subformId = isNested && (subformUniqueId || subformTempId);

      dispatch(updateSelectedField(newFieldData, subformId));

      if (subformId) {
        dispatch(clearSelectedSubformField());
        if (!isNested) {
          dispatch(clearSelectedSubform());
        }
      }
    }
  };

  const submit = data => {
    const randomSubformId = Math.floor(Math.random() * 100000);
    const subformData = setInitialForms(data.subform_section);
    const fieldData = setSubformData(toggleHideOnViewPage(data[selectedFieldName]), subformData);

    const dataToSave = buildDataToSave(selectedField, fieldData, lastField?.get("order"), randomSubformId);

    dataToSave[selectedFieldName].display_conditions_record = fieldArrayToConditions(
      dataToSave[selectedFieldName].display_conditions_record
    );

    batch(() => {
      if (!isNested) {
        onSuccess(dataToSave);
        dialogClose();
      }

      if (fieldData) {
        addOrUpdatedSelectedField(dataToSave);
      }

      if (selectedIsSubformField) {
        if (selectedField.get("name") === NEW_FIELD) {
          dispatch(
            setNewSubform({
              ...subformData,
              temp_id: selectedSubform?.get("temp_id"),
              is_nested: true,
              unique_id: Object.keys(dataToSave)[0]
            })
          );
          dispatch(clearSelectedField());
          dispatch(clearSelectedSubform());
          dialogClose();
        } else {
          dispatch(updateSelectedSubform(subformData));
        }
      }

      if (!isNested) {
        dispatch(clearSelectedField());
        dispatch(clearSelectedSubform());
      }
    });
  };

  const onSubmit = data => {
    submitHandler({
      dispatch,
      data,
      formMethods,
      dirtyFields,
      i18n,
      initialValues: {},
      onSubmit: submit,
      submitAllFields: true
    });
  };

  const memoizedSetValue = useCallback((path, value) => setValue(path, value, { shouldDirty: true }), []);

  const onUpdateTranslation = useCallback(data => {
    getObjectPath("", data || []).forEach(path => {
      const value = get(data, path);
      const {
        fieldsRef: { current: fields }
      } = control;

      if (!fields[path]) {
        register({ name: path });
      }

      setValue(path, value, { shouldDirty: true });
    });
  }, []);

  useEffect(() => {
    if (openFieldDialog && selectedField?.toSeq()?.size) {
      const currFormValues = getValues()[selectedField.get("name")];
      const subform = getUpdatedSubform(selectedField, selectedSubform, getValues());
      const plainSelectedField = selectedField.toJS();

      const { disabled, hide_on_view_page, option_strings_text } = plainSelectedField;
      const selectedFormField = { ...plainSelectedField, disabled: !disabled, hide_on_view_page: !hide_on_view_page };

      const data = mergeTranslationKeys(selectedFormField, currFormValues);

      const fieldData = transformValues(data);

      const optionStringsText = disableOptionStringsText(selectedField, fieldData, option_strings_text);

      const displayConditionsRecord = conditionsToFieldArray(
        reduceMapToObject(selectedField.get("display_conditions_record", fromJS([])))
      );

      reset(
        {
          [selectedFieldName]: {
            ...fieldData,
            display_conditions_record: displayConditionsRecord,
            skip_logic: displayConditionsRecord.length > 0,
            ...([RADIO_FIELD, SELECT_FIELD].includes(selectedField.get("type"))
              ? { option_strings_text: optionStringsText }
              : {})
          },
          ...subform
        },
        RESET_OPTIONS
      );
    }
  }, [isFieldDialogOpen, selectedField]);

  useEffect(() => {
    return () => {
      dialogClose();
    };
  }, []);

  return (
    <>
      <ActionDialog {...modalProps}>
        <form className={css.fieldDialog} onSubmit={handleSubmit(onSubmit)} id={FIELD_FORM}>
          <FieldDialogLabel
            formId={formId}
            isNested={isNested}
            selectedField={selectedField}
            selectedSubform={selectedSubform}
          />
          <FieldsForm fieldsForm={fieldsForm} formMode={formMode} formMethods={formMethods} />
          {skipLogic && (
            <SkipLogic
              formMethods={formMethods}
              conditionsFieldName={`${selectedFieldName}.display_conditions_record`}
              primeroModule={primeroModule}
              recordType={recordType}
              handleClose={backToFieldDialog}
            />
          )}
          {selectedIsSubformField && (
            <SubformFieldsList
              formMethods={formMethods}
              subformField={selectedField}
              subformSortBy={subformSortBy}
              subformGroupBy={subformGroupBy}
            />
          )}
          {selectedIsSubformField && (
            <ClearButtons
              subformField={selectedField}
              subformSortBy={subformSortBy}
              subformGroupBy={subformGroupBy}
              setValue={memoizedSetValue}
            />
          )}
        </form>
        {openTranslationDialog && (
          <FieldTranslationsDialog
            onClose={backToFieldDialog}
            open={openTranslationDialog}
            mode={mode}
            isNested={isNested}
            field={selectedField}
            currentValues={getValues({ nest: true })}
            onSuccess={onUpdateTranslation}
          />
        )}
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formId: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  parentForm: PropTypes.string,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string
};

export default memo(Component);
