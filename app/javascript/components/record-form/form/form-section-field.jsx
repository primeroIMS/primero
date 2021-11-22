import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import clsx from "clsx";

import { useI18n } from "../../i18n";
import {
  DATE_FIELD,
  SELECT_FIELD,
  TICK_FIELD,
  RADIO_FIELD,
  SEPERATOR,
  PHOTO_FIELD,
  AUDIO_FIELD,
  DOCUMENT_FIELD,
  LINK_TO_FORM,
  TALLY_FIELD
} from "../constants";
import Tooltip from "../../tooltip";
import { ConditionalWrapper, displayNameHelper } from "../../../libs";
import { OPTION_TYPES } from "../../form";

import { GuidingQuestions } from "./components";
import { CUSTOM_STRINGS_SOURCE, FORM_SECTION_FIELD_NAME } from "./constants";
import DateField from "./field-types/date-field";
import SelectField from "./field-types/select-field";
import TextField from "./field-types/text-field";
import TickField from "./field-types/tick-field";
import Seperator from "./field-types/seperator";
import RadioField from "./field-types/radio-field";
import AttachmentField from "./field-types/attachments";
import LinkToForm from "./field-types/link-to-form";
import TallyField from "./field-types/tally-field";
import css from "./styles.css";

const FormSectionField = ({
  name,
  field,
  mode,
  recordType,
  recordID,
  recordModuleID,
  filters,
  index,
  formSection,
  isReadWriteForm
}) => {
  const i18n = useI18n();
  const {
    type,
    help_text: helpText,
    display_name: displayName,
    tick_box_label: tickBoxlabel,
    disabled,
    required,
    selected_value: selectedValue,
    hide_on_view_page: hideOnViewPage,
    visible,
    guiding_questions: guidingQuestions,
    link_to_form: linkToForm,
    option_strings_source: optionStringsSource,
    option_strings_text: optionsStringsText,
    options
  } = field;

  const classes = clsx(css.field, { [css.readonly]: mode.isShow });

  const filterOptionStringSource =
    optionStringsSource === CUSTOM_STRINGS_SOURCE.user ? OPTION_TYPES.REFER_TO_USERS : optionStringsSource;

  const optionsSelector = useCallback(
    selectorOptions => ({
      source: filterOptionStringSource,
      options: options || optionsStringsText,
      useUniqueId: OPTION_TYPES.AGENCY === filterOptionStringSource,
      fullUsers: true,
      ...selectorOptions
    }),
    [i18n.locale, options, optionsStringsText, filterOptionStringSource]
  );

  const fieldProps = {
    name,
    field,
    recordType,
    recordID,
    recordModuleID,
    filters,
    autoComplete: "off",
    fullWidth: true,
    InputProps: {
      readOnly: mode.isShow,
      classes: {
        root: css.input
      },
      autoComplete: "new-password",
      disableUnderline: mode.isShow
    },
    InputLabelProps: {
      htmlFor: name,
      shrink: true,
      required,
      classes: {
        root: css.inputLabel
      }
    },
    label: displayNameHelper(displayName, i18n.locale),
    tickBoxlabel: tickBoxlabel?.[i18n.locale],
    helperText: !isEmpty(helpText) ? displayNameHelper(helpText, i18n.locale) : "",
    disabled: mode.isShow || disabled || isReadWriteForm === false,
    checked: ["t", "true"].includes(selectedValue),
    ...(mode.isShow && { placeholder: "--" }),
    index,
    displayName,
    linkToForm,
    ...(type === SELECT_FIELD && { optionsSelector })
  };

  const renderGuidingQuestions = guidingQuestions && guidingQuestions[i18n.locale] && (mode.isEdit || mode.isNew) && (
    <GuidingQuestions label={i18n.t("buttons.guidance")} text={guidingQuestions[i18n.locale]} />
  );

  const FieldComponent = (t => {
    switch (t) {
      case DATE_FIELD:
        return DateField;
      case SELECT_FIELD:
        return SelectField;
      case TICK_FIELD:
        return TickField;
      case RADIO_FIELD:
        return RadioField;
      case SEPERATOR:
        return Seperator;
      case LINK_TO_FORM:
        return LinkToForm;
      case PHOTO_FIELD:
      case AUDIO_FIELD:
      case DOCUMENT_FIELD:
        return AttachmentField;
      case TALLY_FIELD:
        return TallyField;
      default:
        return TextField;
    }
  })(type);

  if ((mode?.isShow && hideOnViewPage) || !visible) return false;

  return (
    <ConditionalWrapper condition={!mode.isShow && disabled} wrapper={Tooltip} title={i18n.t("messages.cannot_edit")}>
      <div className={classes}>
        <FieldComponent {...fieldProps} mode={mode} formSection={formSection} />
        {renderGuidingQuestions}
      </div>
    </ConditionalWrapper>
  );
};

FormSectionField.displayName = FORM_SECTION_FIELD_NAME;

FormSectionField.propTypes = {
  field: PropTypes.object.isRequired,
  filters: PropTypes.object,
  formSection: PropTypes.object,
  index: PropTypes.number,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  recordID: PropTypes.string,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string
};

export default memo(FormSectionField);
