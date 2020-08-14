/* eslint-disable react/no-multi-comp, react/display-name */
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

import { TranslatableOptions } from "./components";
import { buildDefaultOptionStringsText } from "./utils";
import { translationsFieldForm, validationSchema } from "./forms";
import { NAME } from "./constants";

const Component = ({ currentValues, field, mode, onClose, onSuccess, subform }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const locales = i18n.applicationLocales.filter(locale => locale.get("id") !== LOCALE_KEYS.en);
  const {
    name: fieldName,
    display_name: displayName,
    help_text: helpText,
    guiding_questions: guidingQuestions,
    tick_box_label: tickBoxLabel,
    option_strings_text: optionStringsText
  } = field.toJS();

  const { name, description } = subform?.toJS() || {};

  const initialOptionStringsText = buildDefaultOptionStringsText(optionStringsText, locales);

  const defaultOptions = {
    en: optionStringsText?.en || [],
    ...initialOptionStringsText
  };

  const formMethods = useForm({
    defaultValues: {
      subform_section: { name, description },
      [fieldName]: {
        display_name: displayName,
        help_text: helpText,
        guiding_questions: guidingQuestions,
        tick_box_label: tickBoxLabel,
        option_strings_text: defaultOptions
      }
    },
    validationSchema: validationSchema(i18n)
  });
  const selectedLocaleId = formMethods.watch("locale_id", locales.first()?.get("id"));
  const openTranslationDialog = useSelector(state => selectDialog(state, NAME));

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    dispatch(setDialog({ dialog: NAME, open: false }));
  };

  const onSubmit = data => {
    if (onSuccess) {
      onSuccess(data, true);
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
    translationsFieldForm({
      i18n,
      selectedLocaleId,
      cssHideField: css.hideField,
      cssTranslationField: css.translationField,
      locales,
      field,
      subform
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
    const {
      display_name: fieldDisplayName,
      help_text: fieldHelpText,
      guiding_questions: fieldGuidingQuestions,
      tick_box_label: fieldTickBoxLabel,
      option_strings_text: fieldOptionStringsText
    } = currentValues[fieldName] || {};

    formMethods.reset({
      subform_section: {
        name: { ...name, ...currentValues.subform_section?.name },
        description: {
          ...description,
          ...currentValues.subform_section?.description
        }
      },
      [fieldName]: {
        display_name: { ...displayName, ...fieldDisplayName },
        help_text: { ...helpText, ...fieldHelpText },
        guiding_questions: { ...guidingQuestions, ...fieldGuidingQuestions },
        tick_box_label: { ...tickBoxLabel, ...fieldTickBoxLabel },
        option_strings_text: { ...defaultOptions, ...fieldOptionStringsText }
      }
    });
  }, [currentValues]);

  return (
    <ActionDialog {...modalProps}>
      <FormContext {...formMethods} formMode={formMode}>
        <form className={css.formBuilderDialog}>
          {renderForms()}
          <TranslatableOptions field={field} selectedLocaleId={selectedLocaleId} />
        </form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  currentValues: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  subform: PropTypes.object
};

export default Component;
