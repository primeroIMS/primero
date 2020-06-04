/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { batch, useSelector, useDispatch } from "react-redux";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";

import { selectDialog } from "../../../../../record-actions/selectors";
import { setDialog } from "../../../../../record-actions/action-creators";
import bindFormSubmit from "../../../../../../libs/submit-form";
import { submitHandler, whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import ActionDialog from "../../../../../action-dialog";
import { compare } from "../../../../../../libs";
import { getSelectedField, getSelectedSubform } from "../../selectors";
import {
  updateSelectedField,
  updateSelectedSubform
} from "../../action-creators";
import FieldsList from "../fields-list";

import styles from "./styles.css";
import {
  getFormField,
  getSubformValues,
  isSubformField,
  setInitialForms,
  setStartsWithOneEntry,
  setSubformName,
  transformValues,
  toggleHideOnViewPage
} from "./utils";
import { NAME, ADMIN_FIELDS_DIALOG } from "./constants";

const Component = ({ mode, onClose, onSuccess }) => {
  const css = makeStyles(styles)();
  const formMode = whichFormMode(mode);
  const openFieldDialog = useSelector(state =>
    selectDialog(ADMIN_FIELDS_DIALOG, state)
  );
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const selectedSubform = useSelector(
    state => getSelectedSubform(state),
    compare
  );
  const { forms: fieldsForm, validationSchema } = getFormField({
    field: selectedField,
    i18n,
    mode: formMode,
    css
  });

  const formMethods = useForm({ validationSchema });

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
  };

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.update"),
    confirmButtonProps: {
      color: "primary",
      variant: "contained",
      autoFocus: true
    },
    cancelButtonProps: {
      color: "primary",
      variant: "contained",
      className: css.cancelButton
    },
    dialogTitle: isSubformField(selectedField)
      ? selectedSubform.getIn(["name", i18n.locale])
      : i18n.t("fields.edit_label"),
    open: openFieldDialog,
    successHandler: () => bindFormSubmit(formRef),
    cancelHandler: () => {
      handleClose();
    },
    omitCloseAfterSuccess: true
  };

  const onSubmit = data => {
    const fieldName = selectedField.get("name");
    const subformData = setInitialForms(data.subform_section);
    const fieldData = setSubformName(
      toggleHideOnViewPage(data[fieldName]),
      subformData
    );

    batch(() => {
      onSuccess({ [fieldName]: fieldData });
      if (fieldData) {
        dispatch(updateSelectedField({ [fieldName]: fieldData }));
      }
      if (isSubformField(selectedField)) {
        dispatch(updateSelectedSubform(subformData));
      }
      handleClose();
    });
  };

  const renderForms = () =>
    fieldsForm.map(formSection => (
      <FormSection formSection={formSection} key={formSection.unique_id} />
    ));

  const renderFieldsList = () =>
    isSubformField(selectedField) ? (
      <FieldsList subformField={selectedField} />
    ) : null;

  useEffect(() => {
    if (selectedField?.size) {
      const name = selectedField.get("name");
      const fieldData = toggleHideOnViewPage(
        transformValues(selectedField.toJS())
      );

      const subform =
        isSubformField(selectedField) && selectedSubform
          ? setStartsWithOneEntry(getSubformValues(selectedSubform))
          : {};

      formMethods.reset({ [name]: { ...fieldData }, ...subform });
    }
  }, [selectedField]);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues: {},
      onSubmit
    })
  );

  useEffect(() => {
    return () => {
      dispatch(setDialog({ dialog: ADMIN_FIELDS_DIALOG, open: false }));
    };
  }, []);

  return (
    <ActionDialog {...modalProps}>
      <FormContext {...formMethods} formMode={formMode}>
        <form className={css.fieldDialog}>
          {renderForms()}
          {renderFieldsList()}
        </form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Component;
