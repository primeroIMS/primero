import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { getOptions, getLocations } from "../record-form/selectors";
import { getFields } from "../record-form";
import { compare } from "../../libs";
import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import { NAME } from "./constants";
import { getChangeLogs } from "./selectors";
import styles from "./styles.css";
import ChangeLog from "./components/change-log";
import SubformDialog from "./components/subform-dialog";

const Container = ({ record, recordType, mobileDisplay, handleToggleNav }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [open, setOpen] = useState(false);
  const [calculatingChangeLog, setCalculatingChangeLog] = useState(false);
  const [recordChanges, setRecordChanges] = useState({});
  const recordChangeLogs = useSelector(state => getChangeLogs(state, record?.get("id"), recordType));

  const allFields = useSelector(state => getFields(state), compare);
  const allLookups = useSelector(state => getOptions(state), compare);
  const locations = useSelector(state => getLocations(state), compare);

  const sharedProps = {
    allFields,
    allLookups,
    locations,
    setOpen,
    setCalculatingChangeLog
  };

  return (
    <div className={css.container}>
      <RecordFormTitle
        mobileDisplay={mobileDisplay}
        handleToggleNav={handleToggleNav}
        displayText={i18n.t("change_logs.label")}
      />
      <ChangeLog {...sharedProps} recordChangeLogs={recordChangeLogs} setRecordChanges={setRecordChanges} />
      <SubformDialog
        {...sharedProps}
        open={open}
        calculatingChangeLog={calculatingChangeLog}
        recordChanges={recordChanges}
      />
    </div>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Container;
