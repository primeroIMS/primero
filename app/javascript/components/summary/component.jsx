import React from "react";
import PropTypes from "prop-types";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import { FieldRecord, FormSectionField } from "../record-form";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import generateKey from "../charts/table-values/utils";

import { fields, NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ record, recordType, mobileDisplay, handleToggleNav, form }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const findMatchButton = (
    <ActionButton
      icon={<SearchIcon />}
      text={i18n.t("cases.summary.find_match")}
      type={ACTION_BUTTON_TYPES.default}
      keepTextOnMobile
      rest={{
        onClick: () => console.log("Find Match")
      }}
    />
  );

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
      recordID: record?.get("id"),
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
