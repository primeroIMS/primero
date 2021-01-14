import React, { useState } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import { FieldRecord, FormSectionField } from "../record-form";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import generateKey from "../charts/table-values/utils";

import { MatchesForm } from "./components";
import { fields, NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ record, recordType, mobileDisplay, handleToggleNav, form, mode }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordId = record?.get("id");
  const [open, setOpen] = useState(false);
  const findMatchLabel = i18n.t("cases.summary.find_match");
  const findMatchButton = (
    <ActionButton
      icon={<SearchIcon />}
      text={findMatchLabel}
      type={ACTION_BUTTON_TYPES.default}
      keepTextOnMobile
      rest={{
        onClick: () => setOpen(true),
        disabled: mode.isNew
      }}
    />
  );
  const handleClose = () => setOpen(false);

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
        <MatchesForm
          open={open}
          title={findMatchLabel}
          cancelHandler={handleClose}
          record={record}
          i18n={i18n}
          css={css}
          mode={mode}
        />
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
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
