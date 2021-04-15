import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { compare, useMemoizedSelector } from "../../libs";
import { OPTION_TYPES } from "../form/constants";
import { getOptions } from "../form/selectors";
import { useI18n } from "../i18n";
import { getFields } from "../record-form";
import RecordFormTitle from "../record-form/form/record-form-title";
import { getRecordForms, getOptions as getLookups } from "../record-form/selectors";
import { useFormFilters } from "../form-filters";
import { RECORD_TYPES } from "../../config";

import { fetchChangeLogs } from "./action-creators";
import ChangeLog from "./components/change-log";
import SubformDialog from "./components/subform-dialog";
import { NAME } from "./constants";
import { getChangeLogs } from "./selectors";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Container = ({
  selectedForm,
  recordID,
  recordType,
  primeroModule,
  mobileDisplay,
  handleToggleNav,
  fetchable = false
}) => {
  const i18n = useI18n();
  const css = useStyles();
  const dispatch = useDispatch();
  const { selectedFilters } = useFormFilters(selectedForm);

  const [open, setOpen] = useState(false);
  const [calculatingChangeLog, setCalculatingChangeLog] = useState(false);
  const [recordChanges, setRecordChanges] = useState({});

  const forms = useMemoizedSelector(state =>
    getRecordForms(state, { recordType: RECORD_TYPES[recordType], primeroModule })
  );
  const recordChangeLogs = useMemoizedSelector(state =>
    getChangeLogs(state, recordID, recordType, forms, selectedFilters)
  );
  const allFields = useMemoizedSelector(state => getFields(state), compare);
  const allAgencies = useMemoizedSelector(state => getOptions(state, OPTION_TYPES.AGENCY, i18n, null, true), compare);
  const allLookups = useMemoizedSelector(state => getLookups(state), compare);
  const locations = useMemoizedSelector(state => getOptions(state, OPTION_TYPES.LOCATION, i18n), compare);

  useEffect(() => {
    if (fetchable && recordID) {
      dispatch(fetchChangeLogs(recordType, recordID));
    }
  }, [recordID]);

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
  fetchable: PropTypes.bool,
  forms: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string,
  recordID: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string
};

export default Container;
