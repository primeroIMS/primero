import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { useSelector, useDispatch } from "react-redux";

import { localesToRender } from "../utils";
import FormSection from "../../../../../form/components/form-section";
import bindFormSubmit from "../../../../../../libs/submit-form";
import ActionDialog from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import { submitHandler, whichFormMode } from "../../../../../form";
import { setDialog } from "../../../../../record-actions/action-creators";
import { selectDialog } from "../../../../../record-actions/selectors";
import styles from "../styles.css";

import { translationsForm, validationSchema } from "./forms";
import { NAME } from "./constants";

const Component = ({ getValues, mode, onClose, onSuccess }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const currentValues = getValues({ nest: true });
  const formMethods = useForm({
    defaultValues: {
      name: currentValues.name,
      description: currentValues.description
    },
    validationSchema: validationSchema(i18n)
  });
  const openTranslationDialog = useSelector(state => selectDialog(state, NAME));
  const locales = localesToRender(i18n);
  const selectedLocaleId = formMethods.watch("locale_id", locales.first()?.get("id"));

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    dispatch(setDialog({ dialog: NAME, open: false }));
  };

  const onSubmit = data => {
    if (onSuccess) {
      onSuccess(data);
    }
    handleClose();
  };

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.update"),
    confirmButtonProps: {
      icon: <CheckIcon />
    },
    dialogTitle: i18n.t("forms.translations.edit"),
    open: openTranslationDialog,
    successHandler: () => bindFormSubmit(formRef),
    cancelHandler: () => handleClose(),
    omitCloseAfterSuccess: true
  };

  const renderForms = () =>
    translationsForm({
      i18n,
      selectedLocaleId,
      cssHideField: css.hideField,
      cssTranslationField: css.translationField,
      locales,
      currentValues: getValues({ nest: true })
    }).map(form => <FormSection formSection={form} key={form.unique_id} />);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues: {},
      message: i18n.t("forms.translations.no_changes_message"),
      onSubmit
    })
  );

  useEffect(() => {
    if (openTranslationDialog) {
      const currentFormValues = getValues({ nest: true });

      formMethods.reset({
        locale_id: locales?.first()?.get("id"),
        name: { ...currentFormValues.name, ...currentFormValues.translations.name },
        description: { ...currentFormValues.description, ...currentFormValues.translations.description }
      });
    }
  }, [openTranslationDialog]);

  return (
    <ActionDialog {...modalProps}>
      <FormContext {...formMethods} formMode={formMode}>
        <form className={css.formBuilderDialog}>{renderForms()}</form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  getValues: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Component;
