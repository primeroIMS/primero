import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import { FieldRecord, FormSectionField } from "../record-form";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import generateKey from "../charts/table-values/utils";
import { FORMS } from "../record-form/form/subforms/subform-traces/constants";
import SubformDrawer from "../record-form/form/subforms/subform-drawer";
import { getSelectedPotentialMatch } from "../records";
import { RECORD_PATH } from "../../config";

import { MatchesForm, ComparisonForm } from "./components";
import { fields, NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ record, recordType, mobileDisplay, handleToggleNav, form }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordId = record?.get("id");
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(FORMS.matches);
  const potentialMatch = useSelector(state => getSelectedPotentialMatch(state, RECORD_PATH.cases));

  const findMatchLabel = i18n.t("cases.summary.find_match");
  const handleClose = () => setOpen(false);
  const findMatchButton = (
    <ActionButton
      icon={<SearchIcon />}
      text={findMatchLabel}
      type={ACTION_BUTTON_TYPES.default}
      keepTextOnMobile
      rest={{
        onClick: () => setOpen(true)
      }}
    />
  );

  const props = {
    open,
    record,
    i18n,
    css,
    recordType,
    handleBack: handleClose,
    selectedForm,
    setSelectedForm,
    potentialMatch
  };

  const Form = (() => {
    switch (selectedForm) {
      case FORMS.matches:
        return MatchesForm;
      case FORMS.comparison:
        return ComparisonForm;
      default:
        return null;
    }
  })();

  const renderFields = fields(i18n).map(field => {
    const formattedField = FieldRecord(field);
    const fieldProps = {
      name: formattedField.name,
      field: formattedField,
      mode: {
        isShow: true,
        isEdit: false
      },
      recordType,
      recordID: recordId,
      formSection: form
    };

    return (
      <div key={generateKey()} className={css.field}>
        <FormSectionField key={generateKey(formattedField.name)} {...fieldProps} />
      </div>
    );
  });

  return (
    <div>
      <div className={css.container}>
        <RecordFormTitle
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          displayText={i18n.t("cases.summary.label")}
        />
        <div>{findMatchButton}</div>
        <SubformDrawer title={findMatchLabel} open={open} cancelHandler={handleClose}>
          <Form {...props} />
        </SubformDrawer>
      </div>
      {renderFields}
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  form: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
