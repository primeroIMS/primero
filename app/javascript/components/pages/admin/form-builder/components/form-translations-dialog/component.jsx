import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { localesToRender } from "../utils";
import FormSection from "../../../../../form/components/form-section";
import bindFormSubmit from "../../../../../../libs/submit-form";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import { submitHandler, whichFormMode } from "../../../../../form";
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
    resolver: yupResolver(validationSchema(i18n))
  });
  const { dialogOpen, dialogClose } = useDialog(NAME);
  const locales = localesToRender(i18n);
  const selectedLocaleId = formMethods.watch("locale_id", locales.first()?.get("id"));

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    dialogClose();
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
    open: dialogOpen,
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
    if (dialogOpen) {
      const currentFormValues = getValues({ nest: true });

      formMethods.reset({
        locale_id: locales?.first()?.get("id"),
        name: { ...currentFormValues.name, ...currentFormValues.translations.name },
        description: { ...currentFormValues.description, ...currentFormValues.translations.description }
      });
    }
  }, [dialogOpen]);

  return (
    <ActionDialog {...modalProps}>
      <FormProvider {...formMethods} formMode={formMode}>
        <form className={css.formBuilderDialog}>{renderForms()}</form>
      </FormProvider>
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
