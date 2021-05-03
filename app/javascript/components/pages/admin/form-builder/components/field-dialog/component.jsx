/* eslint-disable camelcase */
/* eslint-disable react/display-name, react/no-multi-comp */
import { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { batch, useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import get from "lodash/get";
import set from "lodash/set";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmpty from "lodash/isEmpty";

import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { submitHandler, whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import { getObjectPath, displayNameHelper, useMemoizedSelector } from "../../../../../../libs";
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
import SubformFieldsList from "../subform-fields-list";
import ClearButtons from "../clear-buttons";
import { NEW_FIELD } from "../../constants";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";
import { getOptions } from "../../../../../record-form/selectors";
import { getLabelTypeField } from "../utils";
import FieldTranslationsDialog, { NAME as FieldTranslationsDialogName } from "../field-translations-dialog";
import { SUBFORM_GROUP_BY, SUBFORM_SECTION_CONFIGURATION, SUBFORM_SORT_BY } from "../field-list-item/constants";
import { useApp } from "../../../../../application";

import styles from "./styles.css";
import {
  getFormField,
  getSubformValues,
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
import { NAME, ADMIN_FIELDS_DIALOG, FIELD_FORM, RESET_OPTIONS } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ formId, mode, onClose, onSuccess }) => {
  const css = useStyles();
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { limitedProductionSite } = useApp();

  const { dialogOpen, dialogClose, setDialog } = useDialog([ADMIN_FIELDS_DIALOG, FieldTranslationsDialogName]);

  const selectedField = useMemoizedSelector(state => getSelectedField(state));

  const selectedSubformField = useMemoizedSelector(state => getSelectedSubformField(state));
  const selectedSubform = useMemoizedSelector(state => getSelectedSubform(state));
  const lastField = useMemoizedSelector(state => getSelectedFields(state, false))?.last();
  const lookups = useMemoizedSelector(state => getOptions(state));

  const selectedFieldName = selectedField?.get("name");

  const isNested = subformContainsFieldName(selectedSubform, selectedFieldName, selectedSubformField);
  const { forms: fieldsForm, validationSchema } = getFormField({
    field: selectedField,
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

  const handleClose = () => {
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
  };

  const backToFieldDialog = () => {
    setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: true });
  };

  const editDialogTitle = isSubformField(selectedField)
    ? (selectedSubform.get("name") && displayNameHelper(selectedSubform.get("name"), i18n.locale)) || ""
    : i18n.t("fields.edit_label");

  const dialogTitle = formMode.get("isEdit")
    ? editDialogTitle
    : i18n.t("fields.add_field_type", {
        file_type: i18n.t(`fields.${getLabelTypeField(selectedField)}`)
      });

  const confirmButtonLabel = formMode.get("isEdit") ? i18n.t("buttons.update") : i18n.t("buttons.add");
  const confirmButtonIcon = formMode.get("isNew") ? <Add /> : <CheckIcon />;

  const modalProps = {
    confirmButtonLabel,
    confirmButtonProps: {
      icon: confirmButtonIcon,
      form: FIELD_FORM,
      type: "submit"
    },
    dialogTitle,
    open: openFieldDialog || openTranslationDialog,
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

    batch(() => {
      if (!isNested) {
        onSuccess(dataToSave);
        dialogClose();
      }

      if (fieldData) {
        addOrUpdatedSelectedField(dataToSave);
      }

      if (isSubformField(selectedField)) {
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
      submitAllFields: isSubformField(selectedField)
    });
  };

  const renderForms = () =>
    fieldsForm.map(formSection => (
      <FormSection
        formSection={formSection}
        key={formSection.unique_id}
        formMode={formMode}
        formMethods={formMethods}
      />
    ));

  const memoizedSetValue = useCallback((path, value) => setValue(path, value, { shouldDirty: true }), []);

  const renderClearButtons = () =>
    isSubformField(selectedField) && (
      <ClearButtons
        subformField={selectedField}
        subformSortBy={subformSortBy}
        subformGroupBy={subformGroupBy}
        setValue={memoizedSetValue}
      />
    );

  const onUpdateTranslation = data => {
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
  };

  const renderTranslationsDialog = () =>
    openTranslationDialog ? (
      <FieldTranslationsDialog
        onClose={backToFieldDialog}
        open={openTranslationDialog}
        mode={mode}
        isNested={isNested}
        field={selectedField}
        currentValues={getValues({ nest: true })}
        onSuccess={onUpdateTranslation}
      />
    ) : null;

  const renderAnotherFormLabel = () => {
    const currentFormId = isNested ? selectedSubform.get("id") : parseInt(formId, 10);
    const fieldFormId = selectedField.get("form_section_id");

    return fieldFormId && fieldFormId !== currentFormId ? (
      <p className={css.anotherFormLabel}>{i18n.t("fields.copy_from_another_form")}</p>
    ) : null;
  };

  useEffect(() => {
    if (openFieldDialog && selectedField?.toSeq()?.size) {
      const currFormValues = getValues()[selectedField.get("name")];
      const updatedSubformSection = getValues()?.subform_section;

      const { disabled, hide_on_view_page, option_strings_text } = selectedField.toJS();
      const selectedFormField = { ...selectedField.toJS(), disabled: !disabled, hide_on_view_page: !hide_on_view_page };

      const data = mergeTranslationKeys(selectedFormField, currFormValues);

      const fieldData = transformValues(data);

      let subform =
        isSubformField(selectedField) && selectedSubform.toSeq()?.size ? getSubformValues(selectedSubform) : {};

      if (updatedSubformSection && isSubformField(selectedField)) {
        subform = {
          ...subform,
          subform_section: mergeTranslationKeys(subform.subform_section, updatedSubformSection, true)
        };
      }

      reset(
        {
          [selectedFieldName]: {
            ...fieldData,
            option_strings_text: fieldData.option_strings_text?.map(option => {
              if (!isEmpty(option_strings_text)) {
                return { ...option, disabled: !option_strings_text.find(({ id }) => option.id === id)?.disabled };
              }

              return option;
            })
          },
          ...subform
        },
        RESET_OPTIONS
      );
    }
  }, [openFieldDialog, selectedField]);

  useEffect(() => {
    if (openFieldDialog && selectedFieldName !== NEW_FIELD && selectedField?.toSeq()?.size) {
      const currentData = selectedField;
      const objectPaths = getObjectPath("", currentData.get("option_strings_text", [])).filter(
        option => !option.includes(".en") && !option.includes("id") && !option.includes("disabled")
      );

      objectPaths.forEach(path => {
        const optionStringsTextPath = `${selectedFieldName}.option_strings_text${path}`;
        const {
          fieldsRef: { current: fields }
        } = control;

        if (!fields[optionStringsTextPath]) {
          register({ name: optionStringsTextPath });
        }
        const value = get(currentData.get("option_strings_text"), path);

        setValue(optionStringsTextPath, value, { shouldDirty: true });
      });
    }
  }, [openFieldDialog, selectedField, register]);

  useEffect(() => {
    return () => {
      dialogClose();
    };
  }, []);

  return (
    <>
      <ActionDialog {...modalProps}>
        <form className={css.fieldDialog} onSubmit={handleSubmit(onSubmit)} id={FIELD_FORM}>
          {renderAnotherFormLabel()}
          {renderForms()}
          {isSubformField(selectedField) && (
            <SubformFieldsList
              formMethods={formMethods}
              subformField={selectedField}
              subformSortBy={subformSortBy}
              subformGroupBy={subformGroupBy}
            />
          )}
          {renderClearButtons()}
        </form>
        {renderTranslationsDialog()}
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formId: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default memo(Component);
