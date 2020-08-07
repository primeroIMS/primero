import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { useSelector, useDispatch } from "react-redux";

import { LOCALE_KEYS } from "../../../../../../config";
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

const Component = ({
  currentValues,
  formSection,
  mode,
  onClose,
  onSuccess
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const { name, description } = formSection.toJS();
  const formMethods = useForm({
    defaultValues: {
      name,
      description
    },
    validationSchema: validationSchema(i18n)
  });
  const openTranslationDialog = useSelector(state => selectDialog(state, NAME));
  const locales = i18n.applicationLocales.filter(
    locale => locale.get("id") !== LOCALE_KEYS.en
  );
  const selectedLocaleId = formMethods.watch(
    "locale_id",
    locales.first()?.get("id")
  );

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
      formSection
    }).map(form => <FormSection formSection={form} key={form.unique_id} />);

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
    formMethods.reset({
      name: { ...name, ...currentValues.name },
      description: { ...description, ...currentValues.description }
    });
  }, [currentValues]);

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
  currentValues: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Component;
