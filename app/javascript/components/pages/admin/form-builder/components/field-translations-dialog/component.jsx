/* eslint-disable react/no-multi-comp, react/display-name */
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, useWatch } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import { localesToRender } from "../utils";
import FormSection from "../../../../../form/components/form-section";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import { useMemoizedSelector } from "../../../../../../libs";
import { submitHandler, whichFormMode } from "../../../../../form";
import { getSelectedSubform } from "../../selectors";
import styles from "../styles.css";
import { useApp } from "../../../../../application";

import { TranslatableOptions } from "./components";
import { translationsFieldForm, validationSchema } from "./forms";
import { NAME, FIELD_TRANSLATIONS_FORM } from "./constants";
import { reduceMapToObject } from "./utils";

const useStyles = makeStyles(styles);

const Component = ({ currentValues, field, isNested, mode, onClose, open, onSuccess }) => {
  const css = useStyles();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const locales = localesToRender(i18n);
  const { dialogClose } = useDialog(NAME);
  const { limitedProductionSite } = useApp();

  const selectedSubform = useMemoizedSelector(state => getSelectedSubform(state));

  const {
    name: fieldName,
    display_name: displayName,
    help_text: helpText,
    guiding_questions: guidingQuestions,
    tick_box_label: tickBoxLabel,
    option_strings_text: optionStringsText
  } = reduceMapToObject(field);

  const { name, description } = selectedSubform || {};

  const formMethods = useForm({
    defaultValues: {
      subform_section: { name, description },
      [fieldName]: {
        display_name: displayName,
        help_text: helpText,
        guiding_questions: guidingQuestions,
        tick_box_label: tickBoxLabel,
        option_strings_text: optionStringsText
      }
    },
    resolver: yupResolver(validationSchema(i18n))
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields }
  } = formMethods;

  const selectedLocaleId = useWatch({
    control,
    name: "locale_id"
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dialogClose();
    }
  };

  const onSubmit = data => {
    submitHandler({
      dispatch,
      data,
      dirtyFields,
      formMode,
      i18n,
      initialValues: {},
      message: i18n.t("forms.translations.no_changes_message"),
      onSubmit: formData => {
        if (onSuccess) {
          // eslint-disable-next-line camelcase
          const { locale_id, ...currentData } = { ...formData };

          onSuccess(currentData, true);
        }
        handleClose();
      }
    });
  };

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.update"),
    confirmButtonProps: {
      icon: <CheckIcon />,
      form: FIELD_TRANSLATIONS_FORM,
      type: "submit"
    },
    dialogTitle: i18n.t("forms.translations.edit"),
    open,
    cancelHandler: () => handleClose(),
    omitCloseAfterSuccess: true,
    showSuccessButton: !limitedProductionSite
  };

  const renderForms = () =>
    translationsFieldForm({
      i18n,
      selectedLocaleId,
      cssHideField: css.hideField,
      cssTranslationField: css.translationField,
      locales,
      field,
      subform: selectedSubform,
      currentValues,
      isNested,
      limitedProductionSite
    }).map(form => (
      <FormSection formSection={form} key={form.unique_id} formMode={formMode} formMethods={formMethods} />
    ));

  useEffect(() => {
    if (open) {
      const {
        display_name: fieldDisplayName,
        help_text: fieldHelpText,
        guiding_questions: fieldGuidingQuestions,
        tick_box_label: fieldTickBoxLabel,
        option_strings_text: fieldOptionStringsText
      } = currentValues[fieldName] || {};

      const subformSection =
        currentValues.subform_section ||
        (currentValues[selectedSubform.get("unique_id")]
          ? { name: currentValues[selectedSubform.get("unique_id")].display_name }
          : {});

      reset({
        locale_id: locales?.first()?.get("id"),
        subform_section: {
          name: { ...name, ...subformSection?.name },
          description: {
            ...description,
            ...subformSection?.description
          }
        },
        [fieldName]: {
          display_name: { ...displayName, ...fieldDisplayName },
          help_text: { ...helpText, ...fieldHelpText },
          guiding_questions: { ...guidingQuestions, ...fieldGuidingQuestions },
          tick_box_label: { ...tickBoxLabel, ...fieldTickBoxLabel },
          option_strings_text: { ...optionStringsText, ...fieldOptionStringsText }
        }
      });
    }
  }, [open]);

  return (
    <ActionDialog {...modalProps}>
      <form className={css.formBuilderDialog} onSubmit={handleSubmit(onSubmit)} id={FIELD_TRANSLATIONS_FORM}>
        {renderForms()}
        <TranslatableOptions
          field={field}
          selectedLocaleId={selectedLocaleId}
          formMethods={formMethods}
          formMode={formMode}
        />
      </form>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  isNested: false,
  open: false
};

Component.propTypes = {
  currentValues: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  isNested: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  open: PropTypes.bool,
  subform: PropTypes.object
};

export default Component;
