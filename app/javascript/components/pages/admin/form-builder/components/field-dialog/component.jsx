import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { batch, useSelector, useDispatch } from "react-redux";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";

import { selectDialog } from "../../../../../record-actions/selectors";
import { setDialog } from "../../../../../record-actions/action-creators";
import bindFormSubmit from "../../../../../../libs/submit-form";
import { submitHandler, whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import ActionDialog from "../../../../../action-dialog";
import { compare } from "../../../../../../libs";
import { getSelectedField } from "../../selectors";
import { updateSelectedField } from "../../action-creators";

import styles from "./styles.css";
import { fieldsForm, validationSchema } from "./forms";
import { NAME, ADMIN_FIELDS_DIALOG } from "./constants";

const Component = ({ onClose, onSuccess }) => {
  const css = makeStyles(styles)();
  const openFieldDialog = useSelector(state =>
    selectDialog(ADMIN_FIELDS_DIALOG, state)
  );
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const formMethods = useForm({
    validationSchema: validationSchema(selectedField.get("name"), i18n)
  });
  const formMode = whichFormMode("edit");

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
    dialogTitle: i18n.t("fields.edit_label"),
    open: openFieldDialog,
    successHandler: () => bindFormSubmit(formRef),
    cancelHandler: () => {
      handleClose();
    },
    omitCloseAfterSuccess: true
  };

  const onSubmit = data => {
    batch(() => {
      onSuccess(data);
      dispatch(updateSelectedField(data));
      handleClose();
    });
  };

  useEffect(() => {
    if (selectedField?.size) {
      formMethods.reset({ [selectedField.get("name")]: selectedField.toJS() });
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
          {fieldsForm(selectedField.get("name"), i18n).map(formSection => (
            <FormSection
              formSection={formSection}
              key={formSection.unique_id}
            />
          ))}
        </form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Component;
