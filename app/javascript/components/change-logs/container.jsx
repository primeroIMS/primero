import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import { useState } from "react";

import { compare, useMemoizedSelector } from "../../libs";
import { OPTION_TYPES } from "../form/constants";
import { getOptions } from "../form/selectors";
import { useI18n } from "../i18n";
import { getFields } from "../record-form";
import RecordFormTitle from "../record-form/form/record-form-title";
import { getOptions as getLookups } from "../record-form/selectors";

import ChangeLog from "./components/change-log";
import SubformDialog from "./components/subform-dialog";
import { NAME } from "./constants";
import { getChangeLogs } from "./selectors";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Container = ({ record, recordType, mobileDisplay, handleToggleNav }) => {
  const i18n = useI18n();
  const css = useStyles();
  const [open, setOpen] = useState(false);
  const [calculatingChangeLog, setCalculatingChangeLog] = useState(false);
  const [recordChanges, setRecordChanges] = useState({});
  const recordChangeLogs = useMemoizedSelector(state => getChangeLogs(state, record?.get("id"), recordType));

  const allFields = useMemoizedSelector(state => getFields(state), compare);
  const allAgencies = useMemoizedSelector(state => getOptions(state, OPTION_TYPES.AGENCY, i18n, null, true), compare);
  const allLookups = useMemoizedSelector(state => getLookups(state), compare);
  const locations = useMemoizedSelector(state => getOptions(state, OPTION_TYPES.LOCATION, i18n), compare);

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
