/* eslint-disable react/display-name, react/no-multi-comp */
import React, { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { batch, useSelector, useDispatch } from "react-redux";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import get from "lodash/get";

import { selectDialog } from "../../../../../record-actions/selectors";
import { setDialog } from "../../../../../record-actions/action-creators";
import bindFormSubmit from "../../../../../../libs/submit-form";
import { submitHandler, whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import ActionDialog from "../../../../../action-dialog";
import { compare, getObjectPath } from "../../../../../../libs";
import { getSelectedField, getSelectedSubform, getSelectedFields, getSelectedSubformField } from "../../selectors";
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
  generateUniqueId
} from "./utils";
import { NAME, ADMIN_FIELDS_DIALOG } from "./constants";

const Component = ({ mode, onClose, onSuccess }) => {
  const css = makeStyles(styles)();
  const formMode = whichFormMode(mode);
  const openFieldDialog = useSelector(state => selectDialog(state, ADMIN_FIELDS_DIALOG));
  const openTranslationDialog = useSelector(state => selectDialog(state, FieldTranslationsDialogName));
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const selectedSubformField = useSelector(state => getSelectedSubformField(state), compare);
  const selectedSubform = useSelector(state => getSelectedSubform(state), compare);
  const lastField = useSelector(state => getSelectedFields(state, false), compare)?.last();
  const selectedFieldName = selectedField?.get("name");
  const lookups = useSelector(state => getOptions(state), compare);
  const isNested = subformContainsFieldName(selectedSubform, selectedFieldName, selectedSubformField);
  const { forms: fieldsForm, validationSchema } = getFormField({
    field: selectedField,
    i18n,
    formMode,
    css,
    lookups,
    isNested,
    onManageTranslations: () => {
      dispatch(setDialog({ dialog: FieldTranslationsDialogName, open: true }));
    }
  });
  const formMethods = useForm({ validationSchema });

  const parentFieldName = selectedField?.get("name", "");
  const subformSortBy = formMethods.watch(`${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${SUBFORM_SORT_BY}`);
  const subformGroupBy = formMethods.watch(`${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${SUBFORM_GROUP_BY}`);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    if ((selectedSubform.toSeq().size && !isNested) || selectedSubform.get("isSubformNew")) {
      dispatch(clearSelectedSubform());
    }

    if (selectedSubform.toSeq().size && isNested) {
      if (selectedFieldName === NEW_FIELD) {
        dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
      }
      dispatch(clearSelectedSubformField());
    } else {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
    }

    if (selectedFieldName === NEW_FIELD) {
      dispatch(setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true }));
    }
  };

  const editDialogTitle = isSubformField(selectedField)
    ? selectedSubform.getIn(["name", i18n.locale])
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
      icon: confirmButtonIcon
    },
    dialogTitle,
    open: openFieldDialog,
    successHandler: () => bindFormSubmit(formRef),
    cancelHandler: () => handleClose(),
    omitCloseAfterSuccess: true
  };

  const addOrUpdatedSelectedField = fieldData => {
    let newFieldData = fieldData;
    const subformUniqueId = selectedSubform?.get("unique_id");
    const subformTempId = selectedSubform?.get("temp_id");
    const currentFieldName = selectedFieldName === NEW_FIELD ? Object.keys(fieldData)[0] : selectedFieldName;

    if (typeof fieldData[currentFieldName].disabled !== "undefined" || selectedFieldName === NEW_FIELD) {
      newFieldData = {
        [currentFieldName]: {
          ...fieldData[currentFieldName],
          disabled: !fieldData[currentFieldName].disabled
        }
      };
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
                    subform_section_unique_id: currentFieldName
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

  const onSubmit = data => {
    const randomSubformId = Math.floor(Math.random() * 100000);
    const subformData = setInitialForms(data.subform_section);
    const fieldData = setSubformData(toggleHideOnViewPage(data[selectedFieldName]), subformData);

    const dataToSave = buildDataToSave(selectedField, fieldData, i18n.locale, lastField?.get("order"), randomSubformId);

    batch(() => {
      if (!isNested) {
        onSuccess(dataToSave);
        dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
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
              unique_id: generateUniqueId(subformData.name, i18n.locale)
            })
          );
          dispatch(clearSelectedField());
          dispatch(clearSelectedSubform());
          dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
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

  const renderForms = () =>
    fieldsForm.map(formSection => <FormSection formSection={formSection} key={formSection.unique_id} />);

  const memoizedSetValue = useCallback((path, value) => formMethods.setValue(path, value), []);
  const memoizedRegister = useCallback(prop => formMethods.register(prop), []);
  const memoizedGetValues = useCallback(prop => formMethods.getValues(prop), []);

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

      if (!formMethods.control.fields[path]) {
        formMethods.register({ name: path });
      }

      formMethods.setValue(path, value);
    });
  };

  const renderTranslationsDialog = () =>
    openTranslationDialog ? (
      <FieldTranslationsDialog
        open={openTranslationDialog}
        mode={mode}
        isNested={isNested}
        field={selectedField}
        currentValues={formMethods.getValues({ nest: true })}
        onSuccess={onUpdateTranslation}
      />
    ) : null;

  useEffect(() => {
    if (openFieldDialog && selectedField?.toSeq()?.size) {
      const fieldData = toggleHideOnViewPage(transformValues(selectedField.toJS()));

      const subform =
        isSubformField(selectedField) && selectedSubform.toSeq()?.size ? getSubformValues(selectedSubform) : {};

      const resetOptions = { errors: true, dirtyFields: true, dirty: true, touched: true };

      formMethods.reset(
        {
          [selectedFieldName]: {
            ...fieldData,
            disabled: !fieldData.disabled,
            option_strings_text: fieldData.option_strings_text?.map(option => {
              return { ...option, disabled: !option.disabled };
            })
          },
          ...subform
        },
        resetOptions
      );
    }
  }, [openFieldDialog, selectedField]);

  useEffect(() => {
    if (openFieldDialog && selectedFieldName !== NEW_FIELD && selectedField?.toSeq()?.size) {
      const currentData = selectedField.toJS();
      const objectPaths = getObjectPath("", currentData.option_strings_text || []).filter(
        option => !option.includes(".en") && !option.includes("id") && !option.includes("disabled")
      );

      objectPaths.forEach(path => {
        const optionStringsTextPath = `${selectedFieldName}.option_strings_text${path}`;

        if (!formMethods.control.fields[optionStringsTextPath]) {
          formMethods.register({ name: optionStringsTextPath });
        }
        const value = get(currentData.option_strings_text, path);

        formMethods.setValue(optionStringsTextPath, value);
      });
    }
  }, [openFieldDialog, selectedField, formMethods.register]);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues: {},
      onSubmit,
      submitAllFields: isSubformField(selectedField)
    })
  );

  useEffect(() => {
    return () => {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
    };
  }, []);

  return (
    <>
      <ActionDialog {...modalProps}>
        <FormContext {...formMethods} formMode={formMode}>
          <form className={css.fieldDialog}>
            {renderForms()}
            {isSubformField(selectedField) && (
              <SubformFieldsList
                formContextFields={formMethods.control.fields}
                getValues={memoizedGetValues}
                register={memoizedRegister}
                setValue={memoizedSetValue}
                subformField={selectedField}
                subformSortBy={subformSortBy}
                subformGroupBy={subformGroupBy}
              />
            )}
            {renderClearButtons()}
          </form>
        </FormContext>
        {renderTranslationsDialog()}
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.whyDidYouRender = true;

Component.propTypes = {
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default React.memo(Component);
