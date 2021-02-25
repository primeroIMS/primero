import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { getOptions } from "../form/selectors";
import { getOptions as getLookups } from "../record-form/selectors";
import { OPTION_TYPES } from "../form/constants";
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
  const allAgencies = useSelector(state => getOptions(state, OPTION_TYPES.AGENCY, i18n, null, true), compare);
  const allLookups = useSelector(state => getLookups(state), compare);
  const locations = useSelector(state => getOptions(state, OPTION_TYPES.LOCATION, i18n), compare);

  const sharedProps = {
    allAgencies,
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
